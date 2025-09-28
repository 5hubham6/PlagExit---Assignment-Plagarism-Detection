import os
import io
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging
import threading
from models.submission import Submission
from ml_models.ocr_processor import OCRProcessor
import tempfile
from ml_models.similarity_checker import SimilarityChecker
from ml_models.cheating_detector import CheatingDetector

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.ocr = OCRProcessor()  # Assumes env vars for credentials/processor
    
    def process_submission_async(self, submission_id):
        """Start asynchronous processing of a submission"""
        thread = threading.Thread(target=self._process_submission, args=(submission_id,))
        thread.start()
    
    def _process_submission(self, submission_id):
        """Process a submission with text extraction and plagiarism checking"""
        try:
            # Get the submission
            submission = Submission.objects(id=submission_id).first()
            if not submission:
                logger.error(f"Submission {submission_id} not found")
                return
            
            # Update status to Processing
            submission.processing_status = 'Processing'
            submission.save()
            
            # Extract text from PDF
            pdf_data = submission.answer_file.read()
            extracted_text = self._extract_text_from_pdf(pdf_data)
            submission.ocr_text = extracted_text

            # Correctness analysis: compare to model answer
            assignment = submission.assignment
            model_answer_text = assignment.model_answer_text if hasattr(assignment, 'model_answer_text') else None
            if model_answer_text:
                checker = SimilarityChecker()
                correctness_result = checker.check_answer_correctness(extracted_text, model_answer_text)
                submission.correctness_score = float(correctness_result['similarity_score']) * 100
                submission.correctness_label = correctness_result['correctness']
            else:
                submission.correctness_score = None
                submission.correctness_label = None
            
            # Check for plagiarism
            plagiarism_result, plagiarism_details = self._check_plagiarism(submission)
            submission.plagiarism_result = plagiarism_result
            submission.plagiarism_details = plagiarism_details
            
            # Plagiarism severity and penalty
            severity = getattr(submission, 'plagiarism_severity', None) or 'medium'  # default to medium
            penalty_map = {'easy': 0.10, 'medium': 0.25, 'hard': 0.50}
            penalty = penalty_map.get(severity, 0.25)
            if plagiarism_result == 'found' and submission.correctness_score is not None:
                submission.final_score = round(submission.correctness_score * (1 - penalty), 2)
            else:
                submission.final_score = submission.correctness_score
            
            # Update status to Completed
            submission.processing_status = 'Completed'
            submission.save()
            
            logger.info(f"Successfully processed submission {submission_id}")
            
        except Exception as e:
            logger.error(f"Error processing submission {submission_id}: {str(e)}")
            try:
                submission.processing_status = 'Failed'
                submission.processing_error = str(e)
                submission.save()
            except Exception as save_error:
                logger.error(f"Error updating submission status: {str(save_error)}")
    
    def _extract_text_from_pdf(self, pdf_data):
        """Extract text from PDF using Google Cloud Document AI"""
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
                tmp_file.write(pdf_data)
                tmp_file_path = tmp_file.name
            try:
                text = self.ocr.extract_text_from_pdf(tmp_file_path)
            finally:
                os.remove(tmp_file_path)
            return text
        except Exception as e:
            logger.error(f"Error in PDF text extraction: {str(e)}")
            raise
    
    def _check_plagiarism(self, submission):
        """Check for plagiarism against other submissions using MinHash+LSH and TF-IDF/cosine similarity. Returns 'found' or 'not found'. Also flags previous matching submissions."""
        try:
            # Get all other submissions for the same assignment
            other_submissions = Submission.objects(
                assignment=submission.assignment,
                id__ne=submission.id,
                ocr_text__exists=True
            )
            if not other_submissions:
                return 'not found', {"message": "No other submissions to compare against"}

            # Prepare data for CheatingDetector
            current_text = submission.ocr_text or ""
            submissions_list = [
                {"id": str(s.id), "text": s.ocr_text or ""} for s in other_submissions
            ]
            # Add the current submission as the last item
            submissions_list.append({"id": str(submission.id), "text": current_text})

            detector = CheatingDetector()
            exact_copies = detector.detect_exact_copies(submissions_list)

            # MinHash+LSH result
            flagged = [case for case in exact_copies if str(submission.id) in case['submission_ids']]
            minhash_found = bool(flagged)

            # TF-IDF/cosine similarity
            texts = [s["text"] for s in submissions_list]
            tfidf_matrix = self.vectorizer.fit_transform(texts)
            similarity_scores = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])[0]
            max_similarity = max(similarity_scores) if len(similarity_scores) > 0 else 0
            tfidf_threshold = 0.7  # 70% similarity
            tfidf_found = max_similarity >= tfidf_threshold
            tfidf_details = {
                "max_similarity": float(max_similarity),
                "threshold": tfidf_threshold,
                "comparisons": [
                    {
                        "submission_id": submissions_list[i]["id"],
                        "similarity_score": float(score)
                    }
                    for i, score in enumerate(similarity_scores)
                ]
            }

            # Combine results
            details = {
                "minhash_lsh": flagged[0] if minhash_found else {"message": "No exact copy detected by MinHash+LSH."},
                "tfidf": tfidf_details
            }
            # Decision and flagging
            if minhash_found or tfidf_found:
                # Also flag previous matching submissions
                if minhash_found:
                    for sid in flagged[0]['submission_ids']:
                        if sid != str(submission.id):
                            Submission.objects(id=sid).update(set__plagiarism_result='found')
                if tfidf_found:
                    for i, score in enumerate(similarity_scores):
                        if score >= tfidf_threshold:
                            sid = submissions_list[i]['id']
                            if sid != str(submission.id):
                                Submission.objects(id=sid).update(set__plagiarism_result='found')
                return 'found', details
            else:
                return 'not found', details
        except Exception as e:
            logger.error(f"Error in plagiarism checking: {str(e)}")
            raise

# Create a global instance
document_processor = DocumentProcessor() 
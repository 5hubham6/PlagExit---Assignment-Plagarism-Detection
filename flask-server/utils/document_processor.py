import os
import io
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging
import threading
from models.submission import Submission
from ml_models.ocr_processor import OCRProcessor
from ml_models.similarity_checker import SimilarityChecker
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
        self.similarity_checker = SimilarityChecker()  # Add similarity checker
    
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

            # Check for plagiarism first
            plagiarism_result, plagiarism_details = self._check_plagiarism(submission)
            submission.plagiarism_result = plagiarism_result
            submission.plagiarism_details = plagiarism_details
            
            # Calculate correctness score considering plagiarism
            assignment = submission.assignment
            correctness_score, correctness_label = self._calculate_correctness_score(extracted_text, assignment, plagiarism_result)
            submission.correctness_score = correctness_score
            submission.correctness_label = correctness_label
            
            # Calculate final score (now correctness already considers plagiarism)
            final_score = correctness_score  # No additional penalty needed
            submission.final_score = final_score
            
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
        """Extract text from PDF using improved OCR processor"""
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
                tmp_file.write(pdf_data)
                tmp_file_path = tmp_file.name
            try:
                text = self.ocr.extract_text_from_pdf(tmp_file_path)
                
                # Log extraction results
                if text and len(text.strip()) >= 10:
                    logger.info(f"Text extraction successful: {len(text)} characters")
                    return text.strip()
                else:
                    logger.warning(f"Text extraction returned minimal content: {len(text) if text else 0} characters")
                    return text.strip() if text else ""
                
            finally:
                os.remove(tmp_file_path)
                
        except Exception as e:
            logger.error(f"Error in PDF text extraction: {str(e)}")
            # Return empty text to allow processing to continue
            return ""
    
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
            
            # Check if current text is meaningful
            if len(current_text.strip()) < 50:
                logger.warning(f"Submission {submission.id} has very short text: {len(current_text)} characters")
                return 'not found', {"message": "Text too short for meaningful plagiarism analysis"}
            
            submissions_list = [
                {"id": str(s.id), "text": s.ocr_text or ""} for s in other_submissions
                if s.ocr_text and len(s.ocr_text.strip()) >= 50  # Filter out short texts
            ]
            
            if not submissions_list:
                return 'not found', {"message": "No meaningful submissions to compare against"}
            
            # Add the current submission as the last item
            submissions_list.append({"id": str(submission.id), "text": current_text})

            detector = CheatingDetector(exact_threshold=0.4)  # Lowered from 0.5 to 0.4 for better detection
            exact_copies = detector.detect_exact_copies(submissions_list)

            # MinHash+LSH result
            flagged = [case for case in exact_copies if str(submission.id) in case['submission_ids']]
            minhash_found = bool(flagged)

            # TF-IDF/cosine similarity with error handling
            texts = [s["text"] for s in submissions_list]
            
            try:
                # Configure vectorizer to handle edge cases
                vectorizer = TfidfVectorizer(
                    stop_words='english', 
                    min_df=1,  # Include words that appear in at least 1 document
                    max_features=10000,  # Limit features to avoid memory issues
                    lowercase=True,
                    strip_accents='ascii',
                    token_pattern=r'\b[a-zA-Z]{2,}\b'  # Only words with 2+ letters
                )
                
                tfidf_matrix = vectorizer.fit_transform(texts)
                
                # Check if we got any features
                if tfidf_matrix.shape[1] == 0:
                    logger.warning("TF-IDF vectorizer produced empty vocabulary")
                    tfidf_found = False
                    max_similarity = 0
                    tfidf_details = {
                        "error": "Empty vocabulary - documents may contain only stop words",
                        "max_similarity": 0,
                        "threshold": 0.6
                    }
                else:
                    similarity_scores = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])[0]
                    max_similarity = max(similarity_scores) if len(similarity_scores) > 0 else 0
                    tfidf_threshold = 0.6  # 60% similarity (lowered from 70% to catch more cases)
                    tfidf_found = max_similarity >= tfidf_threshold
                    tfidf_details = {
                        "max_similarity": float(max_similarity),
                        "threshold": 0.6,
                        "vocabulary_size": tfidf_matrix.shape[1],
                        "comparisons": [
                            {
                                "submission_id": submissions_list[i]["id"],
                                "similarity_score": float(score)
                            }
                            for i, score in enumerate(similarity_scores)
                        ]
                    }
            
            except ValueError as ve:
                logger.error(f"TF-IDF vectorization failed: {str(ve)}")
                tfidf_found = False
                max_similarity = 0
                tfidf_details = {
                    "error": str(ve),
                    "max_similarity": 0,
                    "threshold": 0.6
                }            # Combine results
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

    def _calculate_correctness_score(self, text, assignment, plagiarism_result=None):
        """
        Calculate correctness score by comparing student answer to professor's model answer
        Returns: (score, label) where score is 0-100 and label is descriptive
        """
        try:
            if not text or len(text.strip()) < 50:
                return 0, "Insufficient Content"
            
            # Get the professor's model answer
            model_answer = assignment.model_answer_text if assignment else None
            
            if not model_answer or len(model_answer.strip()) < 50:
                # Fallback to basic content analysis if no model answer
                logger.warning(f"No model answer available for assignment {assignment.id if assignment else 'unknown'}")
                return self._fallback_content_analysis(text, plagiarism_result)
            
            # Use SimilarityChecker to compare against model answer
            correctness_analysis = self.similarity_checker.check_answer_correctness(
                student_answer=text,
                correct_answer=model_answer
            )
            
            if 'error' in correctness_analysis:
                logger.error(f"Error in similarity checking: {correctness_analysis['error']}")
                return self._fallback_content_analysis(text, plagiarism_result)
            
            # Extract similarity score and correctness label
            similarity_score = correctness_analysis.get('similarity_score', 0)
            semantic_correctness = correctness_analysis.get('correctness', 'Incorrect')
            confidence = correctness_analysis.get('confidence', 0)
            
            # Convert semantic similarity to percentage score
            base_score = round(similarity_score * 100, 1)
            
            # Apply additional scoring factors
            word_count = len(text.split())
            
            # Bonus for comprehensive answers (but cap at reasonable limits)
            if word_count >= 300:
                completeness_bonus = min(5, (word_count - 300) / 100)  # Up to 5% bonus
                base_score += completeness_bonus
            elif word_count < 100:
                # Penalty for very short answers
                base_score *= (word_count / 100)
            
            # Cap the score at 100%
            base_score = min(100, base_score)
            
            # Apply plagiarism penalty if detected
            if plagiarism_result == 'found':
                penalty_factor = 0.4  # 60% of original score (40% penalty)
                final_score = round(base_score * penalty_factor, 1)
                
                # Create plagiarism-aware label
                if base_score >= 80:
                    label = f"Plagiarized (High Similarity to Model: {base_score:.1f}%)"
                elif base_score >= 60:
                    label = f"Plagiarized (Good Similarity to Model: {base_score:.1f}%)"
                elif base_score >= 40:
                    label = f"Plagiarized (Fair Similarity to Model: {base_score:.1f}%)"
                else:
                    label = f"Plagiarized (Poor Answer: {base_score:.1f}%)"
                
                logger.info(f"Model answer comparison: {base_score:.1f}% similarity → {final_score:.1f}% after plagiarism penalty ({label})")
                return final_score, label
            else:
                # No plagiarism - use original scoring with semantic labels
                if base_score >= 85:
                    label = f"Excellent (Similarity: {similarity_score:.3f})"
                elif base_score >= 70:
                    label = f"Good (Similarity: {similarity_score:.3f})"
                elif base_score >= 55:
                    label = f"Satisfactory (Similarity: {similarity_score:.3f})"
                elif base_score >= 40:
                    label = f"Needs Improvement (Similarity: {similarity_score:.3f})"
                else:
                    label = f"Poor (Similarity: {similarity_score:.3f})"
                
                logger.info(f"Model answer comparison: {similarity_score:.3f} similarity → {base_score:.1f}% score ({semantic_correctness}, {label})")
                return round(base_score, 1), label
            
        except Exception as e:
            logger.error(f"Error calculating correctness score: {str(e)}")
            return self._fallback_content_analysis(text, plagiarism_result)
    
    def _fallback_content_analysis(self, text, plagiarism_result=None):
        """
        Fallback content analysis when model answer is not available
        """
        try:
            word_count = len(text.split())
            
            # Basic content quality scoring
            base_score = 60  # Start with 60% for having content
            
            # Word count scoring
            if word_count >= 200:
                word_score = min(25, (word_count / 400) * 25)
            else:
                word_score = (word_count / 200) * 15
            
            # Structure scoring
            structure_score = 0
            text_lower = text.lower()
            
            if 'assignment' in text_lower or 'name:' in text_lower:
                structure_score += 3
            if 'student id' in text_lower or 'id:' in text_lower:
                structure_score += 2
            if any(word in text_lower for word in ['introduction', 'fundamentals', 'principles']):
                structure_score += 3
            if any(word in text_lower for word in ['conclusion', 'summary']):
                structure_score += 2
            
            # Technical content scoring
            technical_keywords = [
                'software', 'engineering', 'development', 'system', 'design',
                'architecture', 'database', 'algorithm', 'programming', 'testing',
                'methodology', 'principles', 'framework', 'implementation', 'analysis'
            ]
            found_keywords = sum(1 for keyword in technical_keywords if keyword in text_lower)
            technical_score = min(10, found_keywords)
            
            content_score = base_score + word_score + structure_score + technical_score
            content_score = min(100, round(content_score, 1))
            
            # Apply plagiarism penalty
            if plagiarism_result == 'found':
                penalty_factor = 0.4
                final_score = round(content_score * penalty_factor, 1)
                label = f"Plagiarized (Content Quality: {content_score:.1f}%)"
                logger.info(f"Fallback analysis with plagiarism: {content_score:.1f}% → {final_score:.1f}%")
                return final_score, label
            else:
                if content_score >= 90:
                    label = "Good Content (No Model Answer Available)"
                elif content_score >= 80:
                    label = "Fair Content (No Model Answer Available)"
                elif content_score >= 70:
                    label = "Basic Content (No Model Answer Available)"
                else:
                    label = "Poor Content (No Model Answer Available)"
                    
                logger.info(f"Fallback analysis: {content_score:.1f}% content quality ({label})")
                return content_score, label
                
        except Exception as e:
            logger.error(f"Error in fallback content analysis: {str(e)}")
            return 0, "Error in Grading"
    
    def _calculate_final_score(self, correctness_score, plagiarism_result):
        """
        Legacy method - now correctness_score already includes plagiarism penalties
        """
        return correctness_score

# Create a global instance
document_processor = DocumentProcessor() 
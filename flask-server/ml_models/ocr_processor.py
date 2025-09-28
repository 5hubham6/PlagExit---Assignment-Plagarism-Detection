import os
import io
import datetime
import logging
from pdf2image import convert_from_path
import pytesseract

class OCRProcessor:
    def __init__(self, *args, **kwargs):
        self.logger = logging.getLogger(__name__)
        logging.basicConfig(level=logging.INFO)

    def extract_text_from_pdf(self, pdf_path):
        """
        Extract text from a PDF file using Tesseract OCR.
        Args:
            pdf_path (str): Path to the PDF file
        Returns:
            str: Extracted text
        """
        try:
            # Convert PDF to images (one per page)
            images = convert_from_path(pdf_path)
            text = ''
            for i, image in enumerate(images):
                page_text = pytesseract.image_to_string(image)
                text += page_text + '\n'
            return text.strip()
        except Exception as e:
            self.logger.error(f"Error processing PDF with Tesseract: {str(e)}")
            raise

    def process_submission(self, pdf_path):
        """
        Process a student's PDF submission using Tesseract OCR.
        Args:
            pdf_path (str): Path to the PDF file
        Returns:
            dict: Processed submission data including extracted text and metadata
        """
        try:
            extracted_text = self.extract_text_from_pdf(pdf_path)
            return {
                'text': extracted_text,
                'word_count': len(extracted_text.split()),
                'processed_timestamp': datetime.datetime.now().isoformat(),
                'success': True
            }
        except Exception as e:
            self.logger.error(f"Failed to process submission: {str(e)}")
            return {
                'text': '',
                'error': str(e),
                'success': False
            } 
import os
import io
import datetime
import logging
from pdf2image import convert_from_path
import pytesseract
import PyPDF2

class OCRProcessor:
    def __init__(self, *args, **kwargs):
        self.logger = logging.getLogger(__name__)
        logging.basicConfig(level=logging.INFO)

    def extract_text_from_pdf(self, pdf_path):
        """
        Extract text from a PDF file using multiple methods:
        1. Direct text extraction for text-based PDFs (faster)
        2. OCR with Tesseract for image-based/scanned PDFs (slower but handles images)
        
        Args:
            pdf_path (str): Path to the PDF file
        Returns:
            str: Extracted text
        """
        try:
            # Method 1: Try direct text extraction first (for text-based PDFs)
            self.logger.info("Attempting direct PDF text extraction...")
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                direct_text = ""
                for page_num, page in enumerate(pdf_reader.pages):
                    page_text = page.extract_text()
                    direct_text += page_text
                
            # If we got meaningful text, return it
            if direct_text and len(direct_text.strip()) > 50:  # At least 50 characters
                self.logger.info(f"Direct extraction successful: {len(direct_text)} characters")
                return direct_text.strip()
            else:
                self.logger.info("Direct extraction returned insufficient text, trying OCR...")
                
        except Exception as e:
            self.logger.warning(f"Direct PDF text extraction failed: {str(e)}, trying OCR...")
        
        # Method 2: OCR fallback for scanned/image-based PDFs
        try:
            self.logger.info("Starting OCR processing with pdf2image + pytesseract...")
            # Convert PDF to images (one per page)
            images = convert_from_path(pdf_path, dpi=200)  # Good balance of quality vs speed
            text = ''
            
            for i, image in enumerate(images):
                self.logger.info(f"Processing page {i+1}/{len(images)} with OCR...")
                page_text = pytesseract.image_to_string(image, lang='eng')
                text += page_text + '\n'
                
            ocr_result = text.strip()
            self.logger.info(f"OCR processing complete: {len(ocr_result)} characters")
            return ocr_result
            
        except Exception as e:
            self.logger.error(f"OCR processing failed: {str(e)}")
            raise

    def process_submission(self, pdf_path):
        """
        Process a student's PDF submission using the best available method.
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
"""
OCR Service - Optimized Text Extraction
"""
import pytesseract
from PIL import Image
from pdf2image import convert_from_path
import aiofiles
import asyncio
from pathlib import Path

from app.core.config import settings
from app.services.supabase_service import SupabaseService


class OCRService:
    def __init__(self):
        self.supabase = SupabaseService()
        if settings.TESSERACT_CMD:
            pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD
    
    async def extract_text(self, file_path: str) -> str:
        """Extract text from image/PDF using OCR"""
        # Download file from Supabase
        file_content = await self.supabase.download_file(file_path)
        
        # Determine file type
        file_ext = Path(file_path).suffix.lower()
        
        if file_ext in ['.png', '.jpg', '.jpeg', '.gif', '.bmp']:
            # Process image
            return await self._ocr_image(file_content)
        elif file_ext == '.pdf':
            # Process PDF
            return await self._ocr_pdf(file_content)
        else:
            return ""
    
    async def _ocr_image(self, image_data: bytes) -> str:
        """OCR from image bytes"""
        # Save to temp file
        import tempfile
        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp:
            tmp.write(image_data)
            tmp_path = tmp.name
        
        try:
            # Run OCR
            text = await asyncio.to_thread(
                pytesseract.image_to_string,
                Image.open(tmp_path),
                lang='eng+hin+mal+tam+tel',  # Multilingual support
            )
            return text
        finally:
            Path(tmp_path).unlink(missing_ok=True)
    
    async def _ocr_pdf(self, pdf_data: bytes) -> str:
        """OCR from PDF bytes"""
        import tempfile
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
            tmp.write(pdf_data)
            tmp_path = tmp.name
        
        try:
            # Convert PDF to images
            images = await asyncio.to_thread(
                convert_from_path,
                tmp_path,
                dpi=300,
            )
            
            # OCR each page
            texts = []
            for image in images:
                text = await asyncio.to_thread(
                    pytesseract.image_to_string,
                    image,
                    lang='eng+hin+mal+tam+tel',
                )
                texts.append(text)
            
            return "\n\n".join(texts)
        finally:
            Path(tmp_path).unlink(missing_ok=True)

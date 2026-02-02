"""
OCR Service - Optional Text Extraction

On Python 3.13 we skip heavy OCR deps (Pillow, pytesseract, pdf2image) by
default. If they are not installed, this service simply returns empty text so
the rest of the pipeline can still run.
"""
import asyncio
from pathlib import Path

from app.core.config import settings
from app.services.supabase_service import SupabaseService

try:  # Optional heavy deps
    import pytesseract  # type: ignore
    from PIL import Image  # type: ignore
    from pdf2image import convert_from_path  # type: ignore

    _HAS_OCR_DEPS = True
except Exception:  # pragma: no cover
    pytesseract = None  # type: ignore
    Image = None  # type: ignore
    convert_from_path = None  # type: ignore
    _HAS_OCR_DEPS = False


class OCRService:
    def __init__(self):
        self.supabase = SupabaseService()
        if _HAS_OCR_DEPS and settings.TESSERACT_CMD and pytesseract is not None:
            pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD

    async def extract_text(self, file_path: str) -> str:
        """Extract text from image/PDF using OCR.

        In dev without OCR deps, this just returns an empty string.
        """
        if not _HAS_OCR_DEPS:
            return ""

        # Download file from Supabase / local storage
        file_content = await self.supabase.download_file(file_path)

        # Determine file type
        file_ext = Path(file_path).suffix.lower()

        if file_ext in [".png", ".jpg", ".jpeg", ".gif", ".bmp"]:
            return await self._ocr_image(file_content)
        if file_ext == ".pdf":
            return await self._ocr_pdf(file_content)
        return ""

    async def _ocr_image(self, image_data: bytes) -> str:
        """OCR from image bytes"""
        import tempfile

        if not _HAS_OCR_DEPS or pytesseract is None or Image is None:
            return ""

        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
            tmp.write(image_data)
            tmp_path = tmp.name

        try:
            text = await asyncio.to_thread(
                pytesseract.image_to_string,
                Image.open(tmp_path),
                lang="eng+hin+mal+tam+tel",
            )
            return text
        finally:
            Path(tmp_path).unlink(missing_ok=True)

    async def _ocr_pdf(self, pdf_data: bytes) -> str:
        """OCR from PDF bytes"""
        import tempfile

        if not _HAS_OCR_DEPS or pytesseract is None or convert_from_path is None:
            return ""

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(pdf_data)
            tmp_path = tmp.name

        try:
            images = await asyncio.to_thread(
                convert_from_path,
                tmp_path,
                dpi=300,
            )

            texts = []
            for image in images:
                text = await asyncio.to_thread(
                    pytesseract.image_to_string,
                    image,
                    lang="eng+hin+mal+tam+tel",
                )
                texts.append(text)

            return "\n\n".join(texts)
        finally:
            Path(tmp_path).unlink(missing_ok=True)

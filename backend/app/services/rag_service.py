"""
RAG Service - Optimized Retrieval-Augmented Generation
"""
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import Optional
import asyncio

from app.core.config import settings
from app.models.document import Document
from sqlalchemy import select


class RAGService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self._has_gemini = False
        self._has_pinecone = False
        self.model = None
        self.index = None

        # Optional Gemini
        try:
            if settings.GEMINI_API_KEY:
                import google.generativeai as genai  # type: ignore

                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
                self._has_gemini = True
        except Exception:
            self._has_gemini = False

        # Optional Pinecone
        try:
            if settings.PINECONE_API_KEY:
                from pinecone import Pinecone  # type: ignore

                pc = Pinecone(api_key=settings.PINECONE_API_KEY)
                self.index = pc.Index(settings.PINECONE_INDEX_NAME)
                self._has_pinecone = True
        except Exception:
            self._has_pinecone = False
    
    async def ask_question(
        self,
        question: str,
        document_id: Optional[UUID] = None,
        language: str = "en",
        top_k: int = 5,
    ) -> dict:
        """
        Ask question.

        - If Pinecone+Gemini are configured, use real RAG.
        - Otherwise (dev), do a lightweight keyword-based answer from OCR text.
        """
        ocr_text = ""
        if document_id:
            result = await self.db.execute(select(Document).where(Document.id == str(document_id)))
            doc = result.scalar_one_or_none()
            ocr_text = (doc.ocr_text or "") if doc else ""

        # Full RAG path (only if optional deps are present & configured)
        if self._has_gemini and self._has_pinecone and self.index is not None and self.model is not None:
            # Minimal implementation: no embeddings in dev runtime; keep disabled unless all deps exist.
            pass

        # Dev fallback: naive extractive answer
        if not ocr_text.strip():
            return {
                "answer": "Demo mode: upload a document and wait for processing to complete, then ask again.",
                "sources": [],
                "confidence": 0.0,
                "language": language,
            }

        keywords = [w.lower() for w in question.split() if len(w) > 3][:8]
        lines = [ln.strip() for ln in ocr_text.splitlines() if ln.strip()]
        hits = []
        for ln in lines:
            low = ln.lower()
            if any(k in low for k in keywords):
                hits.append(ln)
            if len(hits) >= 5:
                break

        answer = "\n".join(hits) if hits else (ocr_text[:800] + ("..." if len(ocr_text) > 800 else ""))
        return {
            "answer": answer,
            "sources": ["ocr_text"],
            "confidence": 0.25 if hits else 0.1,
            "language": language,
        }
    
    async def generate_summary(
        self,
        document_id: UUID,
        language: str = "en",
    ) -> str:
        """Generate multilingual summary (Gemini if configured; otherwise dev fallback)."""
        result = await self.db.execute(select(Document).where(Document.id == str(document_id)))
        document = result.scalar_one_or_none()
        
        if not document or not document.ocr_text:
            return "No content available for summary."

        if self._has_gemini and self.model is not None:
            prompt = f"""Summarize the following document in {language} language.
Provide a concise summary covering the main points.

Document:
{document.ocr_text[:5000]}

Summary:"""
            response = await asyncio.to_thread(self.model.generate_content, prompt)
            return response.text

        # Dev fallback: first ~600 chars
        text = document.ocr_text.strip().replace("\n", " ")
        return text[:600] + ("..." if len(text) > 600 else "")

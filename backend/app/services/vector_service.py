"""
Vector Service - Embedding Generation
"""
import google.generativeai as genai
import asyncio
from typing import List

from app.core.config import settings


class VectorService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # Use embedding model
        self.embedding_model = genai.GenerativeModel('models/embedding-001')
    
    async def embed_text(self, text: str) -> List[float]:
        """Generate embedding for text"""
        # Use Gemini embedding API
        result = await asyncio.to_thread(
            self.embedding_model.embed_content,
            text
        )
        return result['embedding']
    
    async def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """Split text into chunks for vector storage"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = " ".join(words[i:i + chunk_size])
            if chunk.strip():
                chunks.append(chunk)
        
        return chunks

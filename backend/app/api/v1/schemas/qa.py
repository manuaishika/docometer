"""
Q&A Schemas
"""
from pydantic import BaseModel
from uuid import UUID, Optional


class QuestionRequest(BaseModel):
    question: str
    document_id: Optional[UUID] = None
    language: Optional[str] = "en"


class QuestionResponse(BaseModel):
    answer: str
    sources: list[str] = []
    confidence: float
    language: str

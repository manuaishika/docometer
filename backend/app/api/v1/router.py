"""
API Router - Main Router Configuration
"""
from fastapi import APIRouter

from app.api.v1.endpoints import documents, auth, qa, processing

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(documents.router, prefix="/documents", tags=["Documents"])
api_router.include_router(qa.router, prefix="/qa", tags=["Q&A"])
api_router.include_router(processing.router, prefix="/processing", tags=["Processing"])

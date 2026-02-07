"""
Application Configuration - Environment Variables
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "DocuFlow"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.vercel.app",
    ]
    
    # Database (default to local SQLite for easy dev; can be set to Neon Postgres)
    DATABASE_URL: str = "sqlite+aiosqlite:///./docosphere.db"
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_PRE_PING: bool = True
    
    # Redis Cache
    REDIS_URL: str = "redis://localhost:6379/0"
    CACHE_TTL: int = 3600  # 1 hour default
    
    # Supabase Storage
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_BUCKET: str = "documents"
    
    # Google Gemini AI
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-pro"
    
    # Pinecone Vector DB
    PINECONE_API_KEY: str = ""
    PINECONE_ENVIRONMENT: str = ""
    PINECONE_INDEX_NAME: str = "docosphere"
    PINECONE_DIMENSION: int = 768
    
    # OCR Settings
    OCR_ENGINE: str = "tesseract"  # or "google-vision"
    TESSERACT_CMD: str = "/usr/bin/tesseract"
    
    # Security
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Celery (Async Tasks)
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"
    
    # Performance
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50MB
    ENABLE_CACHE: bool = True
    ENABLE_MONITORING: bool = True

    # Dev convenience (lets the app run without auth + external services)
    DEV_MODE: bool = True
    DEV_USER_EMAIL: str = "demo@local"
    DEV_USERNAME: str = "demo"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

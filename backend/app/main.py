"""
FastAPI Main Application - Optimized for Performance
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import ORJSONResponse
from contextlib import asynccontextmanager
import time

from app.core.config import settings
from app.core.database import init_db
from app.api.v1.router import api_router
from app.core.cache import init_cache
from app.core.monitoring import setup_monitoring


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    await init_db()
    await init_cache()
    setup_monitoring(app)
    yield
    # Shutdown
    pass


# Create FastAPI app with optimizations
app = FastAPI(
    title="DocuSphere API",
    description="AI Document Intelligence Hub - Optimized for Performance",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    default_response_class=ORJSONResponse,  # Faster JSON serialization
    lifespan=lifespan,
)

# Middleware for performance
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# GZip compression for responses
app.add_middleware(GZipMiddleware, minimum_size=1000)


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Include routers
app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "docosphere-api"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        workers=4,  # Multi-worker for better performance
        log_level="info",
    )

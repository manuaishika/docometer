# DocuSphere: AI Document Intelligence Hub

A high-performance, full-stack application for automated multilingual document processing with AI-powered RAG pipeline.

## 🚀 Performance Optimizations

### Backend (FastAPI)
- **Async/Await**: All database operations and I/O are async
- **Connection Pooling**: Optimized PostgreSQL connection pool (20 connections)
- **Redis Caching**: Response caching for frequently accessed data
- **ORJSON**: Faster JSON serialization
- **GZip Compression**: Automatic response compression
- **Multi-worker**: Uvicorn with 4 workers for better concurrency
- **uvloop**: Faster event loop implementation
- **Database Indexes**: Strategic indexes on frequently queried columns
- **Background Tasks**: Async document processing

### Frontend (Next.js)
- **React Query**: Intelligent caching and data fetching
- **SWC Minification**: Faster builds and smaller bundles
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: AVIF and WebP support
- **Standalone Output**: Optimized production builds

## 🏗️ Architecture

- **Backend**: FastAPI with async SQLAlchemy
- **Frontend**: Next.js 14 with App Router
- **Database**: Neon PostgreSQL (async)
- **Vector DB**: Pinecone
- **Storage**: Supabase Cloud Storage
- **AI**: Google Gemini
- **Cache**: Redis
- **OCR**: Tesseract (multilingual)

## 📦 Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set environment variables in .env
cp .env.example .env
# Edit .env with your credentials

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --workers 4
```

### Frontend

```bash
npm install
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql+asyncpg://...
REDIS_URL=redis://localhost:6379/0
SUPABASE_URL=https://...
SUPABASE_KEY=...
GEMINI_API_KEY=...
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=...
PINECONE_INDEX_NAME=docosphere
SECRET_KEY=...
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚢 Deployment

### Backend (Vercel/Hugging Face)
- Use the provided Dockerfile
- Set environment variables
- Deploy with 4 workers

### Frontend (Vercel)
- Connect GitHub repository
- Set environment variables
- Automatic deployments

## 📊 Features

- ✅ Multilingual document processing (English, Hindi, Malayalam, Tamil, Telugu)
- ✅ OCR for images and PDFs
- ✅ RAG-powered Q&A
- ✅ Multilingual summaries
- ✅ Deadline extraction
- ✅ Role-based access control
- ✅ Real-time processing status
- ✅ Optimized caching layer

## 🎯 Performance Metrics

- API Response Time: < 100ms (cached)
- Document Processing: Async background tasks
- Database Queries: Optimized with indexes
- Frontend Load Time: < 2s (optimized bundle)

## 📝 License

MIT

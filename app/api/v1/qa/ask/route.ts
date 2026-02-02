import { NextResponse } from 'next/server'
import { getDocument } from '../../_utils/mockDb'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = (await req.json()) as { question?: string; document_id?: string }
  const question = body.question?.trim() || ''

  if (!question) {
    return NextResponse.json({ detail: 'question is required' }, { status: 400 })
  }

  const doc = body.document_id ? await getDocument(body.document_id) : null

  return NextResponse.json({
    answer: doc
      ? `Demo mode answer for "${doc.title}":\n\nYou asked: ${question}\n\n(Connect the FastAPI backend + AI services for real RAG answers.)`
      : `Demo mode answer:\n\nYou asked: ${question}\n\n(Upload a document or connect the backend for real RAG answers.)`,
    sources: doc ? [doc.id] : [],
    confidence: 0.2,
    language: 'en',
  })
}


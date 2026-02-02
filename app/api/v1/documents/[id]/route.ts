import { NextResponse } from 'next/server'
import { deleteDocument, getDocument } from '../../_utils/mockDb'

export const runtime = 'nodejs'

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const doc = await getDocument(ctx.params.id)
  if (!doc) return NextResponse.json({ detail: 'Not found' }, { status: 404 })
  return NextResponse.json(doc)
}

export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  const ok = await deleteDocument(ctx.params.id)
  if (!ok) return NextResponse.json({ detail: 'Not found' }, { status: 404 })
  return new NextResponse(null, { status: 204 })
}


import { NextResponse } from 'next/server'
import { createDocument, saveUpload } from '../../_utils/mockDb'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get('file')

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ detail: 'file is required' }, { status: 400 })
  }

  const bytes = new Uint8Array(await file.arrayBuffer())
  const uploadPath = await saveUpload(file.name || 'upload', bytes)
  const doc = await createDocument({ fileName: file.name || 'upload', uploadPath })

  return NextResponse.json(doc, { status: 201 })
}


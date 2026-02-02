import { NextResponse } from 'next/server'
import { listDocuments } from '../_utils/mockDb'

export const runtime = 'nodejs'

export async function GET() {
  const items = await listDocuments()
  return NextResponse.json({
    items,
    total: items.length,
    skip: 0,
    limit: 20,
  })
}


import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST() {
  // Demo auth: always succeeds
  return NextResponse.json({
    access_token: 'dev-token',
    token_type: 'bearer',
  })
}


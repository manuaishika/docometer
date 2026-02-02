import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

export type MockDocument = {
  id: string
  title: string
  file_name: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  language?: string
  summary?: string
  extracted_deadline?: string
  created_at: string
  upload_path?: string
}

type MockDb = {
  documents: MockDocument[]
}

const dataDir = path.join(process.cwd(), 'data')
const uploadsDir = path.join(dataDir, 'uploads')
const dbFile = path.join(dataDir, 'mock-db.json')

async function ensureDirs() {
  await fs.mkdir(uploadsDir, { recursive: true })
  await fs.mkdir(dataDir, { recursive: true })
}

async function readDb(): Promise<MockDb> {
  await ensureDirs()
  try {
    const raw = await fs.readFile(dbFile, 'utf8')
    const parsed = JSON.parse(raw) as MockDb
    return { documents: parsed.documents ?? [] }
  } catch {
    const init: MockDb = { documents: [] }
    await fs.writeFile(dbFile, JSON.stringify(init, null, 2), 'utf8')
    return init
  }
}

async function writeDb(db: MockDb) {
  await ensureDirs()
  await fs.writeFile(dbFile, JSON.stringify(db, null, 2), 'utf8')
}

export async function listDocuments() {
  const db = await readDb()
  return db.documents.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
}

export async function getDocument(id: string) {
  const db = await readDb()
  return db.documents.find((d) => d.id === id) ?? null
}

export async function createDocument(params: {
  fileName: string
  uploadPath?: string
}) {
  const db = await readDb()
  const now = new Date().toISOString()
  const doc: MockDocument = {
    id: randomUUID(),
    title: params.fileName || 'Untitled',
    file_name: params.fileName || 'upload',
    status: 'completed',
    created_at: now,
    upload_path: params.uploadPath,
  }
  db.documents.push(doc)
  await writeDb(db)
  return doc
}

export async function deleteDocument(id: string) {
  const db = await readDb()
  const idx = db.documents.findIndex((d) => d.id === id)
  if (idx === -1) return false
  const [doc] = db.documents.splice(idx, 1)
  await writeDb(db)

  // Best-effort file cleanup
  if (doc?.upload_path) {
    try {
      await fs.unlink(doc.upload_path)
    } catch {
      // ignore
    }
  }
  return true
}

export async function saveUpload(fileName: string, bytes: Uint8Array) {
  await ensureDirs()
  const safeName = fileName.replace(/[^\w.\- ]+/g, '_')
  const target = path.join(uploadsDir, `${Date.now()}_${safeName}`)
  await fs.writeFile(target, bytes)
  return target
}


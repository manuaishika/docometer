import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface Document {
  id: string
  title: string
  file_name: string
  status: string
  language?: string
  summary?: string
  extracted_deadline?: string
  created_at: string
}

export interface DocumentsResponse {
  items: Document[]
  total: number
  skip: number
  limit: number
}

export function useDocuments() {
  return useQuery<DocumentsResponse>({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data } = await api.get<DocumentsResponse>('/documents')
      return data
    },
  })
}

export function useDocument(id: string) {
  return useQuery<Document>({
    queryKey: ['document', id],
    queryFn: async () => {
      const { data } = await api.get<Document>(`/documents/${id}`)
      return data
    },
    enabled: !!id,
  })
}

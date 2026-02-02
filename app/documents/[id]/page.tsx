'use client'

import { useDocument } from '@/hooks/useDocuments'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { api } from '@/lib/api'
import { useMutation } from '@tanstack/react-query'

export default function DocumentDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { data: document, isLoading } = useDocument(id)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)

  const askMutation = useMutation({
    mutationFn: async (q: string) => {
      const { data } = await api.post('/qa/ask', {
        question: q,
        document_id: id,
      })
      return data
    },
    onSuccess: (data) => {
      setAnswer(data.answer)
    },
  })

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim()) {
      askMutation.mutate(question)
    }
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  if (!document) {
    return <div className="p-8">Document not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">{document.title}</h1>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-gray-600">Status:</span>{' '}
              <span className="font-medium">{document.status}</span>
            </div>
            <div>
              <span className="text-gray-600">Language:</span>{' '}
              <span className="font-medium">{document.language || 'N/A'}</span>
            </div>
          </div>
          {document.summary && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Summary</h2>
              <p className="text-gray-700">{document.summary}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Ask a Question</h2>
          <form onSubmit={handleAsk} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about this document..."
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                type="submit"
                disabled={askMutation.isPending}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {askMutation.isPending ? 'Asking...' : 'Ask'}
              </button>
            </div>
          </form>
          {answer && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Answer:</h3>
              <p>{answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

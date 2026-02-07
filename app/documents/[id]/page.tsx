'use client'

import { useDocument } from '@/hooks/useDocuments'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '@/lib/api'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, FileText, MessageSquare, Globe, Clock, CheckCircle, Loader2, Send } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function DocumentDetailPage() {
  const params = useParams()
  const router = useRouter()
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
      setQuestion('')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-black dark:text-white animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading document...</p>
        </div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Document Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The document you're looking for doesn't exist.</p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-black dark:text-white" />
      case 'processing':
        return <Loader2 className="h-5 w-5 text-black dark:text-white animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-black dark:text-white" />
    }
  }

  const getStatusColor = (status: string) => {
    return 'bg-white dark:bg-black text-black dark:text-white border-gray-300 dark:border-gray-700'
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      {/* Header */}
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mr-6"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Link>
            <h1 className="text-xl font-bold text-black dark:text-white truncate flex-1">{document.title}</h1>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Document Info Card */}
        <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                <FileText className="h-8 w-8 text-white dark:text-black" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-2">{document.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Uploaded {new Date(document.created_at).toLocaleDateString()}</span>
                  </div>
                  {document.language && (
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4" />
                      <span className="uppercase">{document.language}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${getStatusColor(document.status)}`}>
              {getStatusIcon(document.status)}
              <span className="font-medium capitalize">{document.status}</span>
            </div>
          </div>

          {document.summary && (
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-3 flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-black dark:text-white" />
                <span>AI Summary</span>
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-950 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                {document.summary}
              </p>
            </div>
          )}

          {document.extracted_deadline && (
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-3 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-black dark:text-white" />
                <span>Extracted Deadline</span>
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {new Date(document.extracted_deadline).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>

        {/* Q&A Section */}
        <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6 flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-black dark:text-white" />
            <span>Ask Questions About This Document</span>
          </h2>

          <form onSubmit={handleAsk} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything about this document..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white rounded-xl focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                disabled={askMutation.isPending}
              />
              <button
                type="submit"
                disabled={askMutation.isPending || !question.trim()}
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
              >
                {askMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Asking...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Ask</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {answer && (
            <div className="bg-gray-50 dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-3 flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-black dark:text-white" />
                <span>AI Answer</span>
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{answer}</p>
            </div>
          )}

          {!answer && !askMutation.isPending && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Ask a question to get AI-powered insights about this document</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

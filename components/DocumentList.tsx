'use client'

import { Document } from '@/hooks/useDocuments'
import Link from 'next/link'
import { format } from 'date-fns'
import { FileText, Eye, Clock, Globe, CheckCircle, Loader2, XCircle } from 'lucide-react'

interface DocumentListProps {
  documents: Document[] | undefined
  isLoading: boolean
}

export function DocumentList({ documents, isLoading }: DocumentListProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div className="w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-10 w-10 text-white dark:text-black" />
        </div>
        <h3 className="text-2xl font-bold text-black dark:text-white mb-2">No Documents Yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Upload your first document to start processing with AI-powered intelligence
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Supported formats: PDF, PNG, JPG, JPEG
        </p>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-black dark:text-white" />
      case 'processing':
        return <Loader2 className="h-5 w-5 text-black dark:text-white animate-spin" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-black dark:text-white" />
      default:
        return <Clock className="h-5 w-5 text-black dark:text-white" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-white dark:bg-black text-black dark:text-white border-gray-300 dark:border-gray-700'
      case 'processing':
        return 'bg-white dark:bg-black text-black dark:text-white border-gray-300 dark:border-gray-700'
      case 'failed':
        return 'bg-white dark:bg-black text-black dark:text-white border-gray-300 dark:border-gray-700'
      default:
        return 'bg-white dark:bg-black text-black dark:text-white border-gray-300 dark:border-gray-700'
    }
  }

  return (
    <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <h2 className="text-xl font-bold text-black dark:text-white">Your Documents</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {documents.length} {documents.length === 1 ? 'document' : 'documents'} total
        </p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="flex-shrink-0 w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white dark:text-black" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-1 truncate group-hover:opacity-70 transition-opacity">
                    {doc.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{format(new Date(doc.created_at), 'MMM dd, yyyy')}</span>
                    </div>
                    {doc.language && (
                      <div className="flex items-center space-x-1">
                        <Globe className="h-4 w-4" />
                        <span className="uppercase">{doc.language}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border ${getStatusColor(doc.status)}`}>
                  {getStatusIcon(doc.status)}
                  <span className="text-xs font-medium capitalize">{doc.status}</span>
                </div>

                <Link
                  href={`/documents/${doc.id}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </Link>
              </div>
            </div>

            {doc.summary && (
              <div className="mt-3 pl-16">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{doc.summary}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

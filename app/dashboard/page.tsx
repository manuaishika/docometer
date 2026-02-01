'use client'

import { useDocuments } from '@/hooks/useDocuments'
import { DocumentUpload } from '@/components/DocumentUpload'
import { DocumentList } from '@/components/DocumentList'
import { useState } from 'react'

export default function DashboardPage() {
  const { documents, isLoading, refetch } = useDocuments()
  const [uploadOpen, setUploadOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              DocuSphere
            </h1>
            <p className="text-gray-600">
              AI Document Intelligence Hub - Fast & Optimized
            </p>
          </div>
          <button
            onClick={() => setUploadOpen(true)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Upload Document
          </button>
        </div>

        <DocumentUpload
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onSuccess={refetch}
        />

        <DocumentList documents={documents} isLoading={isLoading} />
      </div>
    </div>
  )
}

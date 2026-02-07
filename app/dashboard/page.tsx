'use client'

import { useDocuments } from '@/hooks/useDocuments'
import { DocumentUpload } from '@/components/DocumentUpload'
import { DocumentList } from '@/components/DocumentList'
import { useState } from 'react'
import { Upload, FileText, Sparkles, LogOut, CheckCircle, Loader2, Globe } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function DashboardPage() {
  const { data: documents, isLoading, refetch } = useDocuments()
  const [uploadOpen, setUploadOpen] = useState(false)

  const totalDocs = documents?.total || 0
  const completed = documents?.items?.filter(d => d.status === 'completed').length || 0
  const processing = documents?.items?.filter(d => d.status === 'processing').length || 0
  const languages = new Set(documents?.items?.map(d => d.language).filter(Boolean)).size || 0

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      {/* Header */}
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-7 w-7 text-black dark:text-white" />
              <span className="text-2xl font-bold text-black dark:text-white">
                DocuFlow
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button className="text-black dark:text-white hover:opacity-70 px-4 py-2 rounded-lg transition-opacity">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-3">
            Welcome to Your Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Upload, process, and analyze your documents with AI-powered intelligence
          </p>
        </div>

        {/* Stats Cards - Fixed Alignment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-black rounded-xl p-6 border border-gray-200 dark:border-gray-800 h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Documents</p>
              <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-white dark:text-black" />
              </div>
            </div>
            <p className="text-4xl font-bold text-black dark:text-white">
              {totalDocs}
            </p>
          </div>

          <div className="bg-white dark:bg-black rounded-xl p-6 border border-gray-200 dark:border-gray-800 h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-white dark:text-black" />
              </div>
            </div>
            <p className="text-4xl font-bold text-black dark:text-white">
              {completed}
            </p>
          </div>

          <div className="bg-white dark:bg-black rounded-xl p-6 border border-gray-200 dark:border-gray-800 h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Processing</p>
              <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Loader2 className="h-5 w-5 text-white dark:text-black" />
              </div>
            </div>
            <p className="text-4xl font-bold text-black dark:text-white">
              {processing}
            </p>
          </div>

          <div className="bg-white dark:bg-black rounded-xl p-6 border border-gray-200 dark:border-gray-800 h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Languages</p>
              <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="h-5 w-5 text-white dark:text-black" />
              </div>
            </div>
            <p className="text-4xl font-bold text-black dark:text-white">
              {languages}
            </p>
          </div>
        </div>

        {/* Upload Button */}
        <div className="mb-8 flex justify-end">
          <button
            onClick={() => setUploadOpen(true)}
            className="group relative bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Document Upload Modal */}
        <DocumentUpload
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onSuccess={refetch}
        />

        {/* Documents List */}
        <DocumentList documents={documents?.items} isLoading={isLoading} />
      </div>
    </div>
  )
}

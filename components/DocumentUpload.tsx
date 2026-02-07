'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { useMutation } from '@tanstack/react-query'
import { X, Upload, FileText, AlertCircle } from 'lucide-react'

interface DocumentUploadProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function DocumentUpload({ open, onClose, onSuccess }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await api.post('/documents/upload', formData)
      return data
    },
    onSuccess: () => {
      onSuccess()
      setFile(null)
      onClose()
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    try {
      await uploadMutation.mutateAsync(file)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black rounded-2xl shadow-2xl max-w-md w-full transform transition-all border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-black dark:text-white">Upload Document</h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Drag and Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive
                ? 'border-black dark:border-white bg-gray-100 dark:bg-gray-900'
                : 'border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white'
            }`}
          >
            {file ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-black dark:bg-white rounded-lg flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-white dark:text-black" />
                </div>
                <div>
                  <p className="font-semibold text-black dark:text-white">{file.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-sm text-black dark:text-white hover:opacity-70 transition-opacity"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center mx-auto">
                  <Upload className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                </div>
                <div>
                  <p className="text-black dark:text-white font-semibold mb-1">
                    Drag and drop your file here
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">or</p>
                </div>
                <label className="inline-block">
                  <span className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 cursor-pointer transition-opacity font-medium">
                    Browse Files
                  </span>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                  />
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Supported: PDF, PNG, JPG, JPEG (Max 50MB)
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {uploadMutation.isError && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-black dark:text-white" />
              <p className="text-sm text-black dark:text-white">
                Upload failed. Please try again.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-900 text-black dark:text-white rounded-lg hover:opacity-90 transition-opacity font-medium border border-gray-300 dark:border-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || uploading}
              className="flex-1 px-4 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

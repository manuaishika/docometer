'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { useMutation } from '@tanstack/react-query'

interface DocumentUploadProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function DocumentUpload({ open, onClose, onSuccess }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      // Let the browser set the multipart boundary automatically.
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
    } finally {
      setUploading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Upload Document</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-4 w-full"
            accept=".pdf,.png,.jpg,.jpeg"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!file || uploading}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { FileText, Trash2, Plus } from 'lucide-react'
import type { RentalDocument } from '@/types'

interface RentalDocumentsProps {
  rentalId: string
  canManageDocuments: boolean
}

const DOCUMENT_LABELS: Record<string, string> = {
  lease: 'Kira Sözleşmesi',
  identification: 'Kimlik Belgesi',
  other: 'Diğer',
}

const DOCUMENT_COLORS: Record<string, string> = {
  lease: 'border-blue-500/30 bg-blue-500/10',
  identification: 'border-green-500/30 bg-green-500/10',
  other: 'border-slate-500/30 bg-slate-500/10',
}

export default function RentalDocuments({
  rentalId,
  canManageDocuments,
}: RentalDocumentsProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [documents, setDocuments] = useState<RentalDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadDocuments()
  }, [rentalId])

  async function loadDocuments() {
    try {
      const response = await fetch(`/api/rentals/${rentalId}/documents`)
      if (response.ok) {
        const data = await response.json()
        setDocuments(data)
      }
    } catch (error) {
      console.error('Belgeler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const docType = (e.target as any).dataset.type || 'other'
    setUploading(true)

    try {
      // Upload to Supabase Storage
      const filePath = `rental-docs/${rentalId}/${Date.now()}-${file.name}`

      // Note: In a real implementation, you'd use Supabase Storage
      // For now, we'll mock with a placeholder URL
      // In production: await supabase.storage.from('rental-documents').upload(filePath, file)

      const fileUrl = `/storage/rental-docs/${filePath}`

      // Save document record
      const response = await fetch(`/api/rentals/${rentalId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: docType,
          file_url: fileUrl,
          file_name: file.name,
          file_size_bytes: file.size,
        }),
      })

      if (response.ok) {
        loadDocuments()
        router.refresh()
      }
    } catch (error) {
      console.error('Yükleme hatası:', error)
      alert('Dosya yüklenemedi')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  async function handleDelete(docId: string) {
    try {
      const response = await fetch(`/api/rentals/${rentalId}/documents/${docId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadDocuments()
        router.refresh()
      }
    } catch (error) {
      console.error('Silme hatası:', error)
      alert('Dosya silinemedi')
    }
  }

  if (!canManageDocuments) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
        <p className="text-slate-400 text-sm">Belgeler Kurumsal paketinde mevcut.</p>
      </div>
    )
  }

  if (loading) {
    return <div className="text-slate-400 text-sm">Yükleniyor...</div>
  }

  return (
    <div className="space-y-4">
      {/* Yükleme Alanı */}
      <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
        <div className="flex items-center justify-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-slate-400" />
          <span className="text-slate-300 font-medium text-sm">Belge Yükle</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(DOCUMENT_LABELS).map(([type, label]) => (
            <button
              key={type}
              onClick={() => {
                const input = fileInputRef.current
                if (input) {
                  input.dataset.type = type
                  input.click()
                }
              }}
              disabled={uploading}
              className="px-2 py-1.5 rounded text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors disabled:opacity-50"
            >
              {label}
            </button>
          ))}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
      </div>

      {/* Belgeler Listesi */}
      {documents.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-4">Henüz belge yüklenmemiş</p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${DOCUMENT_COLORS[doc.document_type]}`}
            >
              <FileText className="w-5 h-5 shrink-0 text-slate-400" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{doc.file_name}</p>
                <p className="text-slate-500 text-xs">
                  {DOCUMENT_LABELS[doc.document_type]}
                </p>
              </div>
              <ConfirmDialog
                trigger={
                  <button className="p-1.5 hover:bg-red-600/20 rounded transition-colors">
                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                  </button>
                }
                title="Belgeyi Sil"
                description="Bu belgeyi silmek istediğinizden emin misiniz?"
                onConfirm={() => handleDelete(doc.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

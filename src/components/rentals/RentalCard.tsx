'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { formatCurrency } from '@/lib/utils'
import { Pencil, Trash2, Calendar, DollarSign, User } from 'lucide-react'
import type { Rental, Client } from '@/types'

interface RentalCardProps {
  rental: Rental
  tenant?: Client
  onEdit?: () => void
  canDelete?: boolean
}

export default function RentalCard({
  rental,
  tenant,
  onEdit,
  canDelete = true,
}: RentalCardProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      const response = await fetch(`/api/rentals/${rental.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Silinemedi')

      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Hata oluştu')
    } finally {
      setDeleting(false)
    }
  }

  const startDate = new Date(rental.start_date)
  const isEnded = rental.end_date && new Date(rental.end_date) < new Date()

  return (
    <div className={`bg-slate-800 border rounded-lg p-5 transition-all ${
      isEnded ? 'border-slate-700 opacity-60' : 'border-slate-700 hover:border-slate-600'
    }`}>
      {/* Durum badge */}
      {isEnded && (
        <div className="mb-3">
          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
            Sonlandı
          </span>
        </div>
      )}

      {/* Kiracı adı */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">{tenant?.full_name || 'Bilinmiyor'}</h3>
          {tenant?.phone && (
            <p className="text-slate-400 text-xs mt-1">{tenant.phone}</p>
          )}
        </div>
        {!isEnded && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 hover:bg-slate-700 rounded transition-colors"
                title="Düzenle"
              >
                <Pencil className="w-4 h-4 text-slate-400" />
              </button>
            )}
            {canDelete && (
              <ConfirmDialog
                trigger={
                  <button
                    className="p-2 hover:bg-red-600/20 rounded transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                  </button>
                }
                title="Kiracıyı Kaldır"
                description="Bu kiracılığı silmek istediğinizden emin misiniz?"
                onConfirm={handleDelete}
              />
            )}
          </div>
        )}
      </div>

      {/* Bilgiler */}
      <div className="space-y-2">
        {/* Kira Tutarı */}
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">
            {formatCurrency(rental.monthly_rent_amount, 'TRY')}
            <span className="text-slate-500">/ay</span>
          </span>
        </div>

        {/* Kira Gün */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-blue-400" />
          <span className="text-slate-300">
            Her ayın {rental.rent_due_day}.
            {rental.rent_due_day === 1 ? ''
              : rental.rent_due_day === 21 ? ''
              : rental.rent_due_day === 31 ? ''
              : ''}
            <span className="text-slate-500"> günü</span>
          </span>
        </div>

        {/* Başlama tarihi */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-slate-300">
            {startDate.toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Notlar */}
      {rental.notes && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-slate-400 text-xs line-clamp-2">{rental.notes}</p>
        </div>
      )}
    </div>
  )
}

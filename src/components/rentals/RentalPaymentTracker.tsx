'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Check, X, Clock } from 'lucide-react'
import type { Rental, RentalPayment } from '@/types'

interface RentalPaymentTrackerProps {
  rental: Rental
  canTrackPayments: boolean
}

export default function RentalPaymentTracker({
  rental,
  canTrackPayments,
}: RentalPaymentTrackerProps) {
  const router = useRouter()
  const [payments, setPayments] = useState<RentalPayment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPayments()
  }, [rental.id])

  async function loadPayments() {
    try {
      const response = await fetch(`/api/rentals/${rental.id}/payments`)
      if (response.ok) {
        const data = await response.json()
        setPayments(data.sort((a: RentalPayment, b: RentalPayment) =>
          new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
        ))
      }
    } catch (error) {
      console.error('Ödemeler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  async function togglePayment(paymentId: string, currentStatus: string) {
    if (!canTrackPayments) return

    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid'
    const paidDate = newStatus === 'paid' ? new Date().toISOString().split('T')[0] : null

    try {
      const response = await fetch(`/api/rentals/${rental.id}/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, paid_date: paidDate }),
      })

      if (response.ok) {
        loadPayments()
        router.refresh()
      }
    } catch (error) {
      console.error('Güncelleme başarısız:', error)
      alert('Hata oluştu')
    }
  }

  if (!canTrackPayments) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
        <p className="text-slate-400 text-sm">Ödeme takibi Profesyonel paketinde mevcut.</p>
      </div>
    )
  }

  if (loading) {
    return <div className="text-slate-400 text-sm">Yükleniyor...</div>
  }

  const paidCount = payments.filter((p) => p.status === 'paid').length
  const lateCount = payments.filter((p) => p.status === 'late').length
  const pendingCount = payments.filter((p) => p.status === 'pending' || p.status === 'late').length

  return (
    <div className="space-y-4">
      {/* İstatistikler */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800 rounded-lg p-3 text-center border border-emerald-500/20">
          <p className="text-emerald-400 text-2xl font-bold">{paidCount}</p>
          <p className="text-slate-400 text-xs mt-1">Ödendi</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 text-center border border-amber-500/20">
          <p className="text-amber-400 text-2xl font-bold">{pendingCount}</p>
          <p className="text-slate-400 text-xs mt-1">Bekleniyor</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 text-center border border-red-500/20">
          <p className="text-red-400 text-2xl font-bold">{lateCount}</p>
          <p className="text-slate-400 text-xs mt-1">Gecikmiş</p>
        </div>
      </div>

      {/* Ödeme Listesi */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {payments.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">Ödeme kaydı yok</p>
        ) : (
          payments.map((payment) => {
            const today = new Date()
            const dueDate = new Date(payment.due_date)
            const isLate = dueDate < today && payment.status !== 'paid'
            const isUpcoming = dueDate >= today

            return (
              <div
                key={payment.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  payment.status === 'paid'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : isLate
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-slate-800 border-slate-700'
                }`}
              >
                {/* Tarih */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">
                    {dueDate.toLocaleDateString('tr-TR', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-slate-400 text-xs">
                    {formatCurrency(payment.amount_due, 'TRY')}
                  </p>
                </div>

                {/* Status Badge */}
                {payment.status === 'paid' ? (
                  <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 rounded">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 text-xs font-medium">
                      {payment.paid_date ? new Date(payment.paid_date).toLocaleDateString('tr-TR') : 'Ödendi'}
                    </span>
                  </div>
                ) : isLate ? (
                  <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded">
                    <X className="w-3 h-3 text-red-400" />
                    <span className="text-red-400 text-xs font-medium">Gecikmiş</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 rounded">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span className="text-amber-400 text-xs font-medium">
                      {isUpcoming ? 'Yaklaşıyor' : 'Bekleniyor'}
                    </span>
                  </div>
                )}

                {/* Toggle Button */}
                {canTrackPayments && payment.status !== 'paid' && (
                  <button
                    onClick={() => togglePayment(payment.id, payment.status)}
                    className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                    title="Ödendi olarak işaretle"
                  >
                    <Check className="w-4 h-4 text-slate-500 hover:text-emerald-400" />
                  </button>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { rentalFormSchema, type RentalFormValues } from '@/lib/validations/rental'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Client, Rental } from '@/types'

interface RentalFormProps {
  propertyId: string
  rentalId?: string
  clients: Client[]
  initialData?: Rental
  onSuccess?: () => void
}

export default function RentalForm({
  propertyId,
  rentalId,
  clients,
  initialData,
  onSuccess,
}: RentalFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!rentalId

  const form = useForm<RentalFormValues>({
    resolver: zodResolver(rentalFormSchema) as any,
    defaultValues: {
      tenant_id: initialData?.tenant_id || '',
      monthly_rent_amount: initialData?.monthly_rent_amount || 0,
      rent_due_day: initialData?.rent_due_day || 5,
      start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
      end_date: initialData?.end_date || null,
      notes: initialData?.notes || '',
    },
  })

  async function onSubmit(values: RentalFormValues) {
    setLoading(true)
    setError(null)

    try {
      const method = isEditing ? 'PUT' : 'POST'
      const endpoint = isEditing ? `/api/rentals/${rentalId}` : '/api/rentals'

      const body = {
        property_id: propertyId,
        ...values,
      }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'İşlem başarısız oldu')
      }

      router.refresh()
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'Hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Kiracı Seçimi */}
      <div className="space-y-2">
        <Label htmlFor="tenant_id" className="text-slate-300">
          Kiracı *
        </Label>
        <select
          id="tenant_id"
          {...form.register('tenant_id')}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Kiracı seçin...</option>
          {clients
            .filter((c) => c.client_type === 'renter' || c.client_type === 'other')
            .map((client) => (
              <option key={client.id} value={client.id}>
                {client.full_name}
                {client.phone ? ` (${client.phone})` : ''}
              </option>
            ))}
        </select>
        {form.formState.errors.tenant_id && (
          <p className="text-red-400 text-sm">{form.formState.errors.tenant_id.message}</p>
        )}
      </div>

      {/* Aylık Kira */}
      <div className="space-y-2">
        <Label htmlFor="monthly_rent_amount" className="text-slate-300">
          Aylık Kira Tutarı (₺) *
        </Label>
        <Input
          id="monthly_rent_amount"
          type="number"
          step="0.01"
          placeholder="50000"
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
          {...form.register('monthly_rent_amount')}
        />
        {form.formState.errors.monthly_rent_amount && (
          <p className="text-red-400 text-sm">{form.formState.errors.monthly_rent_amount.message}</p>
        )}
      </div>

      {/* Kira Gün */}
      <div className="space-y-2">
        <Label htmlFor="rent_due_day" className="text-slate-300">
          Kira Gün (1-31) *
        </Label>
        <Input
          id="rent_due_day"
          type="number"
          min="1"
          max="31"
          placeholder="5"
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
          {...form.register('rent_due_day')}
        />
        <p className="text-slate-400 text-xs">Örn: 5 = Her ayın 5'i</p>
        {form.formState.errors.rent_due_day && (
          <p className="text-red-400 text-sm">{form.formState.errors.rent_due_day.message}</p>
        )}
      </div>

      {/* Başlama Tarihi */}
      <div className="space-y-2">
        <Label htmlFor="start_date" className="text-slate-300">
          Başlama Tarihi *
        </Label>
        <Input
          id="start_date"
          type="date"
          className="bg-slate-700 border-slate-600 text-white"
          {...form.register('start_date')}
        />
        {form.formState.errors.start_date && (
          <p className="text-red-400 text-sm">{form.formState.errors.start_date.message}</p>
        )}
      </div>

      {/* Bitiş Tarihi (opsiyonel) */}
      <div className="space-y-2">
        <Label htmlFor="end_date" className="text-slate-300">
          Bitiş Tarihi (opsiyonel)
        </Label>
        <Input
          id="end_date"
          type="date"
          className="bg-slate-700 border-slate-600 text-white"
          {...form.register('end_date')}
        />
        {form.formState.errors.end_date && (
          <p className="text-red-400 text-sm">{form.formState.errors.end_date.message}</p>
        )}
      </div>

      {/* Notlar */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-slate-300">
          Notlar
        </Label>
        <textarea
          id="notes"
          placeholder="Sözleşme koşulları, özel durumlar vb..."
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          rows={3}
          {...form.register('notes')}
        />
        {form.formState.errors.notes && (
          <p className="text-red-400 text-sm">{form.formState.errors.notes.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? (isEditing ? 'Güncelleniyor...' : 'Ekleniyor...') : isEditing ? 'Güncelle' : 'Kiracı Ekle'}
      </Button>
    </form>
  )
}

'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { leadSchema, type LeadFormValues } from '@/lib/validations/lead'
import { createLeadAction, updateLeadAction } from '@/lib/actions/lead.actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import type { Client, Lead, Property } from '@/types'

interface LeadFormProps {
  lead?: Lead
  clients: Client[]
  properties: Property[]
  defaultClientId?: string
}

export default function LeadForm({ lead, clients, properties, defaultClientId }: LeadFormProps) {
  const [isPending, startTransition] = useTransition()

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: lead ? {
      client_id: lead.client_id,
      property_id: lead.property_id || undefined,
      status: lead.status,
      source: lead.source || undefined,
      budget_min: lead.budget_min || undefined,
      budget_max: lead.budget_max || undefined,
      notes: lead.notes || '',
    } : {
      client_id: defaultClientId || '',
      status: 'new',
    },
  })

  function onSubmit(data: LeadFormValues) {
    const formData = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') formData.append(k, String(v))
    })

    startTransition(async () => {
      if (lead) {
        await updateLeadAction(lead.id, formData)
      } else {
        await createLeadAction(formData)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
      <div className="bg-slate-900 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Lead Bilgileri</h2>

        <div>
          <Label className="text-slate-300">Müşteri *</Label>
          <Select
            defaultValue={lead?.client_id || defaultClientId || ''}
            onValueChange={(v) => setValue('client_id', v ?? '')}
          >
            <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Müşteri seçin..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.client_id && <p className="text-red-400 text-xs mt-1">{errors.client_id.message}</p>}
        </div>

        <div>
          <Label className="text-slate-300">İlgili İlan (opsiyonel)</Label>
          <Select
            defaultValue={lead?.property_id || ''}
            onValueChange={(v) => setValue('property_id', !v ? undefined : v)}
          >
            <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="İlan seçin..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="">Seçilmedi</SelectItem>
              {properties.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.title} - {p.city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Durum *</Label>
            <Select
              defaultValue={lead?.status || 'new'}
              onValueChange={(v) => setValue('status', v as LeadFormValues['status'])}
            >
              <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="new">Yeni</SelectItem>
                <SelectItem value="contacted">İletişimde</SelectItem>
                <SelectItem value="viewing">Geziliyor</SelectItem>
                <SelectItem value="offer">Teklif</SelectItem>
                <SelectItem value="won">Aktif Kiracı</SelectItem>
                <SelectItem value="lost">Ev Sahibi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-slate-300">Kaynak</Label>
            <Select
              defaultValue={lead?.source || ''}
              onValueChange={(v) => setValue('source', v as LeadFormValues['source'])}
            >
              <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Seçin..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="website">Web Sitesi</SelectItem>
                <SelectItem value="referral">Referans</SelectItem>
                <SelectItem value="social">Sosyal Medya</SelectItem>
                <SelectItem value="portal">Portal</SelectItem>
                <SelectItem value="walk_in">Ofise Geldi</SelectItem>
                <SelectItem value="other">Diğer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Min. Bütçe (₺)</Label>
            <Input {...register('budget_min', { setValueAs: (v) => v === '' || v === undefined ? undefined : Number(v) })} type="number" className="mt-1 bg-slate-800 border-slate-700 text-white" />
          </div>
          <div>
            <Label className="text-slate-300">Maks. Bütçe (₺)</Label>
            <Input {...register('budget_max', { setValueAs: (v) => v === '' || v === undefined ? undefined : Number(v) })} type="number" className="mt-1 bg-slate-800 border-slate-700 text-white" />
          </div>
        </div>

        <div>
          <Label className="text-slate-300">Notlar</Label>
          <Textarea {...register('notes')} rows={3} className="mt-1 bg-slate-800 border-slate-700 text-white resize-none" />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
          {isPending ? 'Kaydediliyor...' : lead ? 'Güncelle' : 'Lead Oluştur'}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()} className="border-slate-700 text-slate-300">
          İptal
        </Button>
      </div>
    </form>
  )
}

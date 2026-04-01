'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clientSchema, type ClientFormValues } from '@/lib/validations/client'
import { createClientAction, updateClientAction } from '@/lib/actions/client.actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import type { Client } from '@/types'

const CLIENT_TYPES = [
  { value: 'buyer', label: 'Alıcı' },
  { value: 'seller', label: 'Satıcı' },
  { value: 'renter', label: 'Kiracı' },
  { value: 'landlord', label: 'Ev Sahibi' },
  { value: 'other', label: 'Diğer' },
]

export default function ClientForm({ client }: { client?: Client }) {
  const [isPending, startTransition] = useTransition()

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: client ? {
      full_name: client.full_name,
      email: client.email || '',
      phone: client.phone || '',
      client_type: client.client_type,
      notes: client.notes || '',
    } : {
      client_type: 'buyer',
    },
  })

  function onSubmit(data: ClientFormValues) {
    const formData = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) formData.append(k, String(v))
    })

    startTransition(async () => {
      if (client) {
        await updateClientAction(client.id, formData)
      } else {
        await createClientAction(formData)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
      <div className="bg-slate-900 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Müşteri Bilgileri</h2>

        <div>
          <Label className="text-slate-300">Ad Soyad *</Label>
          <Input {...register('full_name')} className="mt-1 bg-slate-800 border-slate-700 text-white" />
          {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name.message}</p>}
        </div>

        <div>
          <Label className="text-slate-300">Müşteri Tipi *</Label>
          <Select
            defaultValue={client?.client_type || 'buyer'}
            onValueChange={(v) => setValue('client_type', v as ClientFormValues['client_type'])}
          >
            <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {CLIENT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-slate-300">Telefon</Label>
          <Input {...register('phone')} type="tel" className="mt-1 bg-slate-800 border-slate-700 text-white" placeholder="05xx xxx xx xx" />
        </div>

        <div>
          <Label className="text-slate-300">E-posta</Label>
          <Input {...register('email')} type="email" className="mt-1 bg-slate-800 border-slate-700 text-white" />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label className="text-slate-300">Notlar</Label>
          <Textarea {...register('notes')} rows={3} className="mt-1 bg-slate-800 border-slate-700 text-white resize-none" />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
          {isPending ? 'Kaydediliyor...' : client ? 'Güncelle' : 'Müşteri Ekle'}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()} className="border-slate-700 text-slate-300">
          İptal
        </Button>
      </div>
    </form>
  )
}

'use client'

import React, { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { propertySchema, type PropertyFormValues } from '@/lib/validations/property'
import { createProperty, updateProperty } from '@/lib/actions/property.actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import type { Property } from '@/types'

interface PropertyFormProps {
  property?: Property
}

export default function PropertyForm({ property }: PropertyFormProps) {
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = React.useState<string | null>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema) as any,
    defaultValues: property ? {
      title: property.title,
      description: property.description || '',
      property_type: property.property_type,
      listing_type: property.listing_type,
      status: property.status,
      price: property.price,
      currency: property.currency,
      area_sqm: property.area_sqm || undefined,
      rooms: property.rooms || undefined,
      bathrooms: property.bathrooms || undefined,
      floor: property.floor || undefined,
      total_floors: property.total_floors || undefined,
      city: property.city,
      district: property.district || '',
      address_line: property.address_line || '',
    } : {
      status: 'active',
      listing_type: 'sale',
      property_type: 'apartment',
      currency: 'TRY',
    },
  })

  function onSubmit(data: PropertyFormValues) {
    const formData = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) formData.append(k, String(v))
    })

    setServerError(null)
    startTransition(async () => {
      try {
        if (property) {
          const result = await updateProperty(property.id, formData)
          if (result?.error) {
            const msg = typeof result.error === 'string' ? result.error : JSON.stringify(result.error)
            setServerError(msg)
          }
        } else {
          const result = await createProperty(formData)
          if (result?.error) {
            const msg = typeof result.error === 'string' ? result.error : JSON.stringify(result.error)
            setServerError(msg)
          }
        }
      } catch (err) {
        setServerError(err instanceof Error ? err.message : 'Bir hata oluştu')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {/* Error Message */}
      {serverError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{serverError}</p>
        </div>
      )}

      {/* Temel Bilgiler */}
      <div className="bg-slate-900 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Temel Bilgiler</h2>
        <div>
          <Label className="text-slate-300">Başlık *</Label>
          <Input {...register('title')} className="mt-1 bg-slate-800 border-slate-700 text-white" />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">İlan Türü *</Label>
            <Select
              defaultValue={property?.listing_type || 'sale'}
              onValueChange={(v) => setValue('listing_type', v as 'sale' | 'rent')}
            >
              <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="sale">Satılık</SelectItem>
                <SelectItem value="rent">Kiralık</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-slate-300">Emlak Tipi *</Label>
            <Select
              defaultValue={property?.property_type || 'apartment'}
              onValueChange={(v) => setValue('property_type', v as PropertyFormValues['property_type'])}
            >
              <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="apartment">Daire</SelectItem>
                <SelectItem value="house">Müstakil Ev</SelectItem>
                <SelectItem value="land">Arsa</SelectItem>
                <SelectItem value="commercial">Ticari</SelectItem>
                <SelectItem value="other">Diğer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Fiyat *</Label>
            <Input
              {...register('price', { setValueAs: (v) => v === '' ? undefined : Number(v) })}
              type="number"
              className="mt-1 bg-slate-800 border-slate-700 text-white"
            />
            {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <Label className="text-slate-300">Durum *</Label>
            <Select
              defaultValue={property?.status || 'active'}
              onValueChange={(v) => setValue('status', v as PropertyFormValues['status'])}
            >
              <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="pending">Bekliyor</SelectItem>
                <SelectItem value="sold">Satıldı</SelectItem>
                <SelectItem value="rented">Kiralandı</SelectItem>
                <SelectItem value="passive">Pasif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-slate-300">Açıklama</Label>
          <Textarea
            {...register('description')}
            rows={4}
            className="mt-1 bg-slate-800 border-slate-700 text-white resize-none"
          />
        </div>
      </div>

      {/* Detaylar */}
      <div className="bg-slate-900 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Detaylar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-slate-300">m²</Label>
            <Input {...register('area_sqm', { setValueAs: (v) => v === '' ? undefined : Number(v) })} type="number" className="mt-1 bg-slate-800 border-slate-700 text-white" />
          </div>
          <div>
            <Label className="text-slate-300">Oda Sayısı</Label>
            <Input {...register('rooms', { setValueAs: (v) => v === '' ? undefined : Number(v) })} type="number" className="mt-1 bg-slate-800 border-slate-700 text-white" />
          </div>
          <div>
            <Label className="text-slate-300">Banyo</Label>
            <Input {...register('bathrooms', { setValueAs: (v) => v === '' ? undefined : Number(v) })} type="number" className="mt-1 bg-slate-800 border-slate-700 text-white" />
          </div>
          <div>
            <Label className="text-slate-300">Bulunduğu Kat</Label>
            <Input {...register('floor', { setValueAs: (v) => v === '' ? undefined : Number(v) })} type="number" className="mt-1 bg-slate-800 border-slate-700 text-white" />
          </div>
        </div>
      </div>

      {/* Konum */}
      <div className="bg-slate-900 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Konum</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Şehir *</Label>
            <Input {...register('city')} className="mt-1 bg-slate-800 border-slate-700 text-white" />
            {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <Label className="text-slate-300">İlçe</Label>
            <Input {...register('district')} className="mt-1 bg-slate-800 border-slate-700 text-white" />
          </div>
        </div>
        <div>
          <Label className="text-slate-300">Adres</Label>
          <Input {...register('address_line')} className="mt-1 bg-slate-800 border-slate-700 text-white" />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
          {isPending ? 'Kaydediliyor...' : property ? 'Güncelle' : 'İlan Oluştur'}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()} className="border-slate-700 text-slate-300">
          İptal
        </Button>
      </div>
    </form>
  )
}

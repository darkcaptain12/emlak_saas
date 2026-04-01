'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

const STATUS_OPTIONS = [
  { value: '', label: 'Tüm Durumlar' },
  { value: 'active', label: 'Aktif' },
  { value: 'pending', label: 'Bekliyor' },
  { value: 'sold', label: 'Satıldı' },
  { value: 'rented', label: 'Kiralandı' },
  { value: 'passive', label: 'Pasif' },
]

const TYPE_OPTIONS = [
  { value: '', label: 'Tüm Tipler' },
  { value: 'apartment', label: 'Daire' },
  { value: 'house', label: 'Müstakil Ev' },
  { value: 'land', label: 'Arsa' },
  { value: 'commercial', label: 'Ticari' },
  { value: 'other', label: 'Diğer' },
]

const LISTING_OPTIONS = [
  { value: '', label: 'Satılık & Kiralık' },
  { value: 'sale', label: 'Satılık' },
  { value: 'rent', label: 'Kiralık' },
]

export default function PropertyFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.replace(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const hasFilters =
    searchParams.has('q') ||
    searchParams.has('status') ||
    searchParams.has('type') ||
    searchParams.has('listing')

  const clearAll = () => {
    router.replace(pathname)
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1 min-w-48 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
        <Input
          defaultValue={searchParams.get('q') ?? ''}
          onChange={(e) => updateParam('q', e.target.value)}
          placeholder="Başlık, şehir, ilçe..."
          className="pl-9 bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 h-9 text-sm"
        />
      </div>

      {/* Status */}
      <select
        value={searchParams.get('status') ?? ''}
        onChange={(e) => updateParam('status', e.target.value)}
        className="h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Type */}
      <select
        value={searchParams.get('type') ?? ''}
        onChange={(e) => updateParam('type', e.target.value)}
        className="h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        {TYPE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Listing */}
      <select
        value={searchParams.get('listing') ?? ''}
        onChange={(e) => updateParam('listing', e.target.value)}
        className="h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        {LISTING_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Temizle
        </button>
      )}
    </div>
  )
}

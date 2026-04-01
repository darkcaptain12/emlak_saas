import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { canCreateProperty, getPropertyLimitStatus } from '@/lib/permissions'
import { PACKAGE_CONFIGS } from '@/lib/config/packages'
import PageHeader from '@/components/layout/PageHeader'
import PropertyStatusBadge from '@/components/properties/PropertyStatusBadge'
import PropertyFilters from '@/components/properties/PropertyFilters'
import EmptyState from '@/components/shared/EmptyState'
import { formatCurrency, formatRelativeDate } from '@/lib/utils'
import { Building2, MapPin, Maximize2, BedDouble, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import type { Property, PropertyStatus, PropertyType, ListingType } from '@/types'

const TYPE_LABELS: Record<string, string> = {
  apartment: 'Daire', house: 'Müstakil', land: 'Arsa', commercial: 'Ticari', other: 'Diğer',
}
const LISTING_LABELS: Record<string, string> = { sale: 'Satılık', rent: 'Kiralık' }

interface PropertiesPageProps {
  searchParams: Promise<{
    q?: string
    status?: string
    type?: string
    listing?: string
  }>
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const sp = await searchParams
  const supabase = await createClient()

  // Get current user and package type
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let pkg = 'pack1'

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('package_type')
      .eq('id', user.id)
      .single()

    if (profile) {
      pkg = profile.package_type || 'pack1'
    }
  }

  let query = supabase
    .from('properties')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (sp.status) query = query.eq('status', sp.status as PropertyStatus)
  if (sp.type) query = query.eq('property_type', sp.type as PropertyType)
  if (sp.listing) query = query.eq('listing_type', sp.listing as ListingType)
  if (sp.q) {
    const q = `%${sp.q}%`
    query = query.or(`title.ilike.${q},city.ilike.${q},district.ilike.${q}`)
  }

  const { data: properties } = await query

  // Total count for limit check (unfiltered)
  const { count: totalCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .is('deleted_at', null)

  const currentCount = totalCount ?? 0
  const pkgConfig = PACKAGE_CONFIGS[pkg]
  const limitReached = !canCreateProperty(pkg, currentCount)
  const limitStatus = getPropertyLimitStatus(pkg, currentCount)

  const isFiltered = !!(sp.q || sp.status || sp.type || sp.listing)

  return (
    <div>
      <PageHeader
        title="İlanlar"
        description={
          pkgConfig.propertyLimit !== null
            ? `${currentCount} / ${pkgConfig.propertyLimit} ilan`
            : `${currentCount} ilan`
        }
        action={
          limitReached
            ? undefined
            : { label: 'Yeni İlan', href: '/properties/new' }
        }
      />

      {/* Limit warning */}
      {limitReached && (
        <div className="flex items-center gap-3 px-4 py-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/30">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300 flex-1">
            <span className="font-semibold">İlan limitine ulaştınız</span>
            {pkgConfig.propertyLimit !== null && (
              <> ({currentCount}/{pkgConfig.propertyLimit})</>
            )}
            . Yeni ilan eklemek için paketinizi yükseltin.
          </p>
          <Link
            href="/packages"
            className="text-xs text-red-400 hover:text-red-300 font-medium whitespace-nowrap"
          >
            Paket Yükselt →
          </Link>
        </div>
      )}

      {/* Limit progress (warning) */}
      {limitStatus === 'warning' && !limitReached && pkgConfig.propertyLimit !== null && (
        <div className="mb-5">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>{currentCount} ilan kullanılıyor</span>
            <span>Limit: {pkgConfig.propertyLimit}</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (currentCount / pkgConfig.propertyLimit) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <Suspense>
        <PropertyFilters />
      </Suspense>

      {/* Empty */}
      {!properties?.length ? (
        <EmptyState
          title={isFiltered ? 'Aramanızla eşleşen ilan yok' : 'Henüz ilan yok'}
          description={
            isFiltered
              ? 'Farklı filtreler deneyin veya tüm filreleri temizleyin.'
              : 'İlk ilanınızı ekleyerek portföyünüzü oluşturun.'
          }
          action={
            isFiltered
              ? undefined
              : limitReached
              ? undefined
              : { label: 'Yeni İlan Ekle', href: '/properties/new' }
          }
          icon={<Building2 className="w-12 h-12" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(properties as Property[]).map((p) => (
            <Link key={p.id} href={`/properties/${p.id}`}>
              <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-slate-600 transition-all hover:shadow-lg hover:shadow-black/20 cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                      {TYPE_LABELS[p.property_type]}
                    </span>
                    <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                      {LISTING_LABELS[p.listing_type]}
                    </span>
                  </div>
                  <PropertyStatusBadge status={p.status} />
                </div>

                <h3 className="text-white font-semibold text-base mb-1 line-clamp-1 group-hover:text-blue-300 transition-colors">
                  {p.title}
                </h3>

                <div className="flex items-center gap-1 text-slate-400 text-sm mb-3">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">
                    {p.district ? `${p.district}, ` : ''}
                    {p.city}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-slate-500 text-sm mb-4">
                  {p.area_sqm && (
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-3 h-3" />
                      {p.area_sqm} m²
                    </span>
                  )}
                  {p.rooms && (
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-3 h-3" />
                      {p.rooms} oda
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-lg font-bold text-white">
                    {formatCurrency(p.price, p.currency)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatRelativeDate(p.created_at)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

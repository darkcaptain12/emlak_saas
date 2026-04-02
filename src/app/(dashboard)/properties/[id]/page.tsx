import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deleteProperty } from '@/lib/actions/property.actions'
import PageHeader from '@/components/layout/PageHeader'
import PropertyStatusBadge from '@/components/properties/PropertyStatusBadge'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import RentalsList from '@/components/rentals/RentalsList'
import { formatCurrency, formatDate } from '@/lib/utils'
import { canManageRentals } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/lib/button-variants'
import { cn } from '@/lib/utils'
import { MapPin, Maximize2, BedDouble, Bath, Layers, Pencil, Trash2, TrendingUp } from 'lucide-react'
import type { Property, Client } from '@/types'

const TYPE_LABELS: Record<string, string> = {
  apartment: 'Daire', house: 'Müstakil Ev', land: 'Arsa', commercial: 'Ticari', other: 'Diğer',
}
const LISTING_LABELS: Record<string, string> = { sale: 'Satılık', rent: 'Kiralık' }

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (!property) notFound()

  const p = property as Property

  // Kiracı yönetimi ve lead takibi için gerekli veriler
  let userPackage = 'pack1'
  let clients: Client[] = []

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('package_type')
      .eq('id', user.id)
      .single()
    userPackage = profile?.package_type || 'pack1'

    const { data: clientsData } = await supabase
      .from('clients')
      .select('*')
      .eq('agent_id', user.id)
      .is('deleted_at', null)
    clients = (clientsData as Client[]) || []
  }

  async function handleDelete() {
    'use server'
    await deleteProperty(id)
    redirect('/properties')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
              {TYPE_LABELS[p.property_type]}
            </span>
            <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
              {LISTING_LABELS[p.listing_type]}
            </span>
            <PropertyStatusBadge status={p.status} />
          </div>
          <h1 className="text-2xl font-bold text-white">{p.title}</h1>
          <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
            <MapPin className="w-3 h-3" />
            <span>{p.address_line ? `${p.address_line}, ` : ''}{p.district ? `${p.district}, ` : ''}{p.city}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/properties/${p.id}/edit`} className={cn(buttonVariants({ variant: 'outline' }), 'border-slate-700 text-slate-300')}>
            <Pencil className="w-4 h-4 mr-2" />
            Düzenle
          </Link>
          <ConfirmDialog
            trigger={
              <Button variant="destructive" size="icon">
                <Trash2 className="w-4 h-4" />
              </Button>
            }
            title="İlanı Sil"
            description="Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
            onConfirm={handleDelete}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ana Bilgiler */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Fiyat</h2>
            <p className="text-3xl font-bold text-white">{formatCurrency(p.price, p.currency)}</p>
          </div>

          {p.description && (
            <div className="bg-slate-900 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">Açıklama</h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{p.description}</p>
            </div>
          )}
        </div>

        {/* Özellikler */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Özellikler</h2>
            <div className="space-y-3">
              {p.area_sqm && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-400 text-sm">
                    <Maximize2 className="w-4 h-4" /> Alan
                  </span>
                  <span className="text-white text-sm font-medium">{p.area_sqm} m²</span>
                </div>
              )}
              {p.rooms && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-400 text-sm">
                    <BedDouble className="w-4 h-4" /> Oda
                  </span>
                  <span className="text-white text-sm font-medium">{p.rooms}</span>
                </div>
              )}
              {p.bathrooms && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-400 text-sm">
                    <Bath className="w-4 h-4" /> Banyo
                  </span>
                  <span className="text-white text-sm font-medium">{p.bathrooms}</span>
                </div>
              )}
              {p.floor != null && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-400 text-sm">
                    <Layers className="w-4 h-4" /> Kat
                  </span>
                  <span className="text-white text-sm font-medium">
                    {p.floor}{p.total_floors ? ` / ${p.total_floors}` : ''}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Bilgiler</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Eklenme</span>
                <span className="text-white">{formatDate(p.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Güncelleme</span>
                <span className="text-white">{formatDate(p.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kiracılar Bölümü - Kiralık Mülkler */}
      {p.listing_type === 'rent' && (
        <div className="mt-8 pt-8 border-t border-slate-800">
          <RentalsList
            propertyId={id}
            clients={clients}
            canManageRentals={canManageRentals(userPackage as any)}
          />
        </div>
      )}

      {/* Müşteri Takip - Satılık Mülkler */}
      {p.listing_type === 'sale' && (
        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-slate-400" />
              <h2 className="text-white font-semibold">Teklifler & Müşteri Takip</h2>
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center">
            <p className="text-slate-400 text-sm">Bu mülk için henüz teklif veya müşteri yok.</p>
            <p className="text-slate-500 text-xs mt-2">Müşteri Takip sayfasından müşteri ekleyerek bu mülkü takip edebilirsiniz.</p>
          </div>
        </div>
      )}
    </div>
  )
}

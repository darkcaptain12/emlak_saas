import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deleteClientAction } from '@/lib/actions/client.actions'
import PageHeader from '@/components/layout/PageHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/lib/button-variants'
import { formatDate, formatRelativeDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Phone, Mail, Pencil, Trash2, TrendingUp } from 'lucide-react'
import type { Client, Lead } from '@/types'

const TYPE_MAP: Record<string, { label: string; className: string }> = {
  buyer:    { label: 'Alıcı',      className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  seller:   { label: 'Satıcı',     className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  renter:   { label: 'Kiracı',     className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  landlord: { label: 'Ev Sahibi',  className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  other:    { label: 'Diğer',      className: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
}

const LEAD_STATUS_MAP: Record<string, { label: string; className: string }> = {
  new:       { label: 'Yeni',       className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  contacted: { label: 'İletişimde', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  viewing:   { label: 'Geziliyor',  className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  offer:     { label: 'Teklif',     className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  won:       { label: 'Kazanıldı',  className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  lost:      { label: 'Kaybedildi', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: client }, { data: leads }] = await Promise.all([
    supabase.from('clients').select('*').eq('id', id).is('deleted_at', null).single(),
    supabase.from('leads').select('*, properties(title, city)').eq('client_id', id).order('created_at', { ascending: false }),
  ])

  if (!client) notFound()

  const c = client as Client
  const typeInfo = TYPE_MAP[c.client_type] || TYPE_MAP.other

  async function handleDelete() {
    'use server'
    await deleteClientAction(id)
    redirect('/clients')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
            {c.full_name[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">{c.full_name}</h1>
              <Badge variant="outline" className={typeInfo.className}>{typeInfo.label}</Badge>
            </div>
            <p className="text-slate-400 text-sm">Eklenme: {formatDate(c.created_at)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/clients/${c.id}/edit`} className={cn(buttonVariants({ variant: 'outline' }), 'border-slate-700 text-slate-300')}>
            <Pencil className="w-4 h-4 mr-2" />
            Düzenle
          </Link>
          <ConfirmDialog
            trigger={<Button variant="destructive" size="icon"><Trash2 className="w-4 h-4" /></Button>}
            title="Müşteriyi Sil"
            description="Bu müşteriyi silmek istediğinizden emin misiniz?"
            onConfirm={handleDelete}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* İletişim */}
        <div className="bg-slate-900 rounded-xl p-6 space-y-3">
          <h2 className="text-white font-semibold mb-4">İletişim</h2>
          {c.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">{c.phone}</span>
            </div>
          )}
          {c.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">{c.email}</span>
            </div>
          )}
          {!c.phone && !c.email && (
            <p className="text-slate-500 text-sm">İletişim bilgisi yok</p>
          )}
          {c.notes && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-slate-400 text-xs mb-2">Notlar</p>
              <p className="text-slate-300 text-sm">{c.notes}</p>
            </div>
          )}
        </div>

        {/* Leads */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Leadler ({leads?.length || 0})</h2>
            <Link href={`/leads/new?client_id=${c.id}`} className={cn(buttonVariants({ size: 'sm' }), 'bg-blue-600 hover:bg-blue-700')}>
              Yeni Müşteri
            </Link>
          </div>
          {!leads?.length ? (
            <p className="text-slate-500 text-sm">Bu müşteri için henüz lead yok.</p>
          ) : (
            <div className="space-y-2">
              {(leads as Lead[]).map((lead) => {
                const statusInfo = LEAD_STATUS_MAP[lead.status] || LEAD_STATUS_MAP.new
                return (
                  <Link key={lead.id} href={`/leads/${lead.id}`} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                    <TrendingUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm">
                        {(lead as Lead & { properties?: { title: string; city: string } | null }).properties?.title || 'İlan belirtilmemiş'}
                      </p>
                      <p className="text-slate-500 text-xs">{formatRelativeDate(lead.created_at)}</p>
                    </div>
                    <Badge variant="outline" className={statusInfo.className}>{statusInfo.label}</Badge>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

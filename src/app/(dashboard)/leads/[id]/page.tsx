import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deleteLeadAction, addLeadNote } from '@/lib/actions/lead.actions'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/lib/button-variants'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { formatDate, formatCurrency, formatRelativeDate } from '@/lib/utils'
import { Pencil, Trash2, Building2, User, Send } from 'lucide-react'
import type { Lead, LeadNote } from '@/types'

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  new:       { label: 'Yeni',       className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  contacted: { label: 'İletişimde', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  viewing:   { label: 'Geziliyor',  className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  offer:     { label: 'Teklif',     className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  won:       { label: 'Kazanıldı',  className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  lost:      { label: 'Kaybedildi', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

const SOURCE_MAP: Record<string, string> = {
  website: 'Web Sitesi', referral: 'Referans', social: 'Sosyal Medya',
  portal: 'Portal', walk_in: 'Ofise Geldi', other: 'Diğer',
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: lead }, { data: notes }] = await Promise.all([
    supabase.from('leads').select('*, clients(*), properties(title, city, price, currency)').eq('id', id).single(),
    supabase.from('lead_notes').select('*').eq('lead_id', id).order('created_at', { ascending: false }),
  ])

  if (!lead) notFound()

  const l = lead as Lead & {
    clients: { full_name: string; phone?: string; email?: string }
    properties?: { title: string; city: string; price: number; currency: string } | null
  }

  const statusInfo = STATUS_MAP[l.status] || STATUS_MAP.new

  async function handleDelete() {
    'use server'
    await deleteLeadAction(id)
    redirect('/leads')
  }

  async function handleAddNote(formData: FormData) {
    'use server'
    const body = formData.get('body') as string
    if (body?.trim()) await addLeadNote(id, body.trim())
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={statusInfo.className}>{statusInfo.label}</Badge>
            {l.source && (
              <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                {SOURCE_MAP[l.source]}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white">
            {l.clients?.full_name} → {l.properties?.title || 'Lead'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Oluşturulma: {formatDate(l.created_at)}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/leads/${l.id}/edit`} className={cn(buttonVariants({ variant: 'outline' }), 'border-slate-700 text-slate-300')}>
            <Pencil className="w-4 h-4 mr-2" />
            Düzenle
          </Link>
          <ConfirmDialog
            trigger={<Button variant="destructive" size="icon"><Trash2 className="w-4 h-4" /></Button>}
            title="Lead'i Sil"
            description="Bu lead'i silmek istediğinizden emin misiniz?"
            onConfirm={handleDelete}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol panel */}
        <div className="space-y-4">
          {/* Müşteri */}
          <div className="bg-slate-900 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4" /> Müşteri
            </h2>
            <Link href={`/clients/${l.client_id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                {l.clients?.full_name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{l.clients?.full_name}</p>
                {l.clients?.phone && <p className="text-slate-400 text-xs">{l.clients.phone}</p>}
              </div>
            </Link>
          </div>

          {/* İlan */}
          {l.properties && (
            <div className="bg-slate-900 rounded-xl p-5">
              <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> İlan
              </h2>
              <Link href={`/properties/${l.property_id}`} className="hover:opacity-80 transition-opacity">
                <p className="text-white text-sm font-medium">{l.properties.title}</p>
                <p className="text-slate-400 text-xs">{l.properties.city}</p>
                <p className="text-blue-400 text-sm mt-1 font-semibold">
                  {formatCurrency(l.properties.price, l.properties.currency)}
                </p>
              </Link>
            </div>
          )}

          {/* Bütçe */}
          {(l.budget_min || l.budget_max) && (
            <div className="bg-slate-900 rounded-xl p-5">
              <h2 className="text-white font-semibold mb-3">Bütçe</h2>
              <p className="text-white">
                {l.budget_min && formatCurrency(l.budget_min)}
                {l.budget_min && l.budget_max && ' – '}
                {l.budget_max && formatCurrency(l.budget_max)}
              </p>
            </div>
          )}

          {/* Notlar alanı */}
          {l.notes && (
            <div className="bg-slate-900 rounded-xl p-5">
              <h2 className="text-white font-semibold mb-3">Notlar</h2>
              <p className="text-slate-300 text-sm">{l.notes}</p>
            </div>
          )}
        </div>

        {/* Aktivite */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Aktivite Geçmişi</h2>

          {/* Not ekle */}
          <form action={handleAddNote} className="flex gap-2 mb-6">
            <Textarea
              name="body"
              placeholder="Not ekleyin..."
              rows={2}
              className="bg-slate-800 border-slate-700 text-white resize-none flex-1"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 self-end">
              <Send className="w-4 h-4" />
            </Button>
          </form>

          {/* Notlar */}
          {!notes?.length ? (
            <p className="text-slate-500 text-sm">Henüz aktivite yok. Yukarıdan not ekleyin.</p>
          ) : (
            <div className="space-y-3">
              {(notes as LeadNote[]).map((note) => (
                <div key={note.id} className="bg-slate-800 rounded-lg p-4">
                  <p className="text-slate-300 text-sm whitespace-pre-wrap">{note.body}</p>
                  <p className="text-slate-500 text-xs mt-2">{formatRelativeDate(note.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

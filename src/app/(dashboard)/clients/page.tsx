import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/layout/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import { formatRelativeDate } from '@/lib/utils'
import { Users, Phone, Mail, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { Client } from '@/types'

const TYPE_MAP: Record<string, { label: string; className: string }> = {
  buyer:    { label: 'Alıcı',      className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  seller:   { label: 'Satıcı',     className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  renter:   { label: 'Kiracı',     className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  landlord: { label: 'Ev Sahibi',  className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  other:    { label: 'Diğer',      className: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
}

export default async function ClientsPage() {
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (
    <div>
      <PageHeader
        title="Müşteriler"
        description={`${clients?.length || 0} müşteri`}
        action={{ label: 'Yeni Müşteri', href: '/clients/new' }}
      />

      {!clients?.length ? (
        <EmptyState
          title="Henüz müşteri yok"
          description="İlk müşterinizi ekleyerek takibe başlayın."
          action={{ label: 'Müşteri Ekle', href: '/clients/new' }}
          icon={<Users className="w-12 h-12" />}
        />
      ) : (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="divide-y divide-slate-800">
            {(clients as Client[]).map((c) => {
              const typeInfo = TYPE_MAP[c.client_type] || TYPE_MAP.other
              return (
                <Link key={c.id} href={`/clients/${c.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-800/50 transition-colors group">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {c.full_name[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{c.full_name}</span>
                      <Badge variant="outline" className={typeInfo.className}>{typeInfo.label}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400 text-sm">
                      {c.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {c.phone}
                        </span>
                      )}
                      {c.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {c.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-slate-500 text-xs">{formatRelativeDate(c.created_at)}</span>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

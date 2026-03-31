import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/layout/PageHeader'
import LeadKanban from '@/components/leads/LeadKanban'
import EmptyState from '@/components/shared/EmptyState'
import { TrendingUp } from 'lucide-react'

export default async function LeadsPage() {
  const supabase = await createClient()

  const { data: leads } = await supabase
    .from('leads')
    .select('*, clients(full_name), properties(title, city)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <PageHeader
        title="Lead Takip"
        description={`${leads?.length || 0} aktif lead`}
        action={{ label: 'Yeni Lead', href: '/leads/new' }}
      />

      {!leads?.length ? (
        <EmptyState
          title="Henüz lead yok"
          description="Müşteri ilgilerini takip etmek için lead oluşturun."
          action={{ label: 'Lead Oluştur', href: '/leads/new' }}
          icon={<TrendingUp className="w-12 h-12" />}
        />
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <LeadKanban leads={leads as any} />
      )}
    </div>
  )
}

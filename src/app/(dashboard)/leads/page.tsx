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
        title="Müşteri Takip"
        description={`${leads?.length || 0} aktif müşteri`}
        action={{ label: 'Yeni Müşteri', href: '/leads/new' }}
      />

      {!leads?.length ? (
        <EmptyState
          title="Henüz müşteri yok"
          description="Müşteri ilgilerini takip etmek için müşteri oluşturun."
          action={{ label: 'Müşteri Oluştur', href: '/leads/new' }}
          icon={<TrendingUp className="w-12 h-12" />}
        />
      ) : (
        <LeadKanban leads={leads} />
      )}
    </div>
  )
}

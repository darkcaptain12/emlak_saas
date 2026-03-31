import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/layout/PageHeader'
import LeadForm from '@/components/leads/LeadForm'
import type { Client, Property } from '@/types'

export default async function NewLeadPage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string }>
}) {
  const { client_id } = await searchParams
  const supabase = await createClient()

  const [{ data: clients }, { data: properties }] = await Promise.all([
    supabase.from('clients').select('*').is('deleted_at', null).order('full_name'),
    supabase.from('properties').select('id, title, city').is('deleted_at', null).eq('status', 'active').order('title'),
  ])

  return (
    <div>
      <PageHeader title="Yeni Lead" description="Müşteri ilgisini kaydedin" />
      <LeadForm
        clients={(clients as Client[]) || []}
        properties={(properties as Property[]) || []}
        defaultClientId={client_id}
      />
    </div>
  )
}

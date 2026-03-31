import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/layout/PageHeader'
import LeadForm from '@/components/leads/LeadForm'
import type { Client, Lead, Property } from '@/types'

export default async function EditLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: lead }, { data: clients }, { data: properties }] = await Promise.all([
    supabase.from('leads').select('*').eq('id', id).single(),
    supabase.from('clients').select('*').is('deleted_at', null).order('full_name'),
    supabase.from('properties').select('id, title, city').is('deleted_at', null).order('title'),
  ])

  if (!lead) notFound()

  return (
    <div>
      <PageHeader title="Lead Düzenle" />
      <LeadForm
        lead={lead as Lead}
        clients={(clients as Client[]) || []}
        properties={(properties as Property[]) || []}
      />
    </div>
  )
}

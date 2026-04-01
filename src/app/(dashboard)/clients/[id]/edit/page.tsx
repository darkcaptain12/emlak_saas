import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/layout/PageHeader'
import ClientForm from '@/components/clients/ClientForm'
import type { Client } from '@/types'

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (!client) notFound()

  return (
    <div>
      <PageHeader title="Müşteriyi Düzenle" description={client.full_name} />
      <ClientForm client={client as Client} />
    </div>
  )
}

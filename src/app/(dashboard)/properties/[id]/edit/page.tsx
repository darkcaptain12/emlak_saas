import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/layout/PageHeader'
import PropertyForm from '@/components/properties/PropertyForm'
import type { Property } from '@/types'

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (!property) notFound()

  return (
    <div>
      <PageHeader title="İlanı Düzenle" description={property.title} />
      <PropertyForm property={property as Property} />
    </div>
  )
}

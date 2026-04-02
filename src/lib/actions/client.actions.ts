'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { clientSchema } from '@/lib/validations/client'

async function checkPackage(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase.from('profiles').select('package_type').eq('id', userId).single()
  return !!data?.package_type
}

export async function createClientAction(formData: FormData) {

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  if (!await checkPackage(supabase, user.id)) {
    return { error: 'Aktif bir paketiniz bulunmamaktadır. Lütfen bir paket satın alın.' }
  }

  const raw = Object.fromEntries(formData)
  const parsed = clientSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const { error } = await supabase.from('clients').insert({
    ...parsed.data,
    agent_id: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath('/clients')
  redirect('/clients')
}

export async function updateClientAction(id: string, formData: FormData) {

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  if (!await checkPackage(supabase, user.id)) {
    return { error: 'Aktif bir paketiniz bulunmamaktadır.' }
  }

  const raw = Object.fromEntries(formData)
  const parsed = clientSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const { error } = await supabase
    .from('clients')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('agent_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/clients')
  revalidatePath(`/clients/${id}`)
  redirect(`/clients/${id}`)
}

export async function deleteClientAction(id: string) {

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  if (!await checkPackage(supabase, user.id)) {
    return { error: 'Aktif bir paketiniz bulunmamaktadır.' }
  }

  const { error } = await supabase
    .from('clients')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('agent_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/clients')
  redirect('/clients')
}

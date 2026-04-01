'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { leadSchema } from '@/lib/validations/lead'
import type { LeadStatus } from '@/types'

export async function createLeadAction(formData: FormData) {

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const raw = Object.fromEntries(formData)
  const parsed = leadSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const { error } = await supabase.from('leads').insert({
    ...parsed.data,
    agent_id: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath('/leads')
  redirect('/leads')
}

export async function updateLeadAction(id: string, formData: FormData) {

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const raw = Object.fromEntries(formData)
  const parsed = leadSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const { error } = await supabase
    .from('leads')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('agent_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/leads')
  revalidatePath(`/leads/${id}`)
  redirect(`/leads/${id}`)
}

export async function updateLeadStatus(id: string, status: LeadStatus) {

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('agent_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/leads')
  return { success: true }
}

export async function addLeadNote(leadId: string, body: string) {

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('lead_notes').insert({
    lead_id: leadId,
    agent_id: user.id,
    body,
  })

  if (error) return { error: error.message }

  revalidatePath(`/leads/${leadId}`)
  return { success: true }
}

export async function deleteLeadAction(id: string) {

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)
    .eq('agent_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/leads')
  redirect('/leads')
}

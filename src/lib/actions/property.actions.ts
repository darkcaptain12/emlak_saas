'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { propertySchema } from '@/lib/validations/property'
import { canCreateProperty } from '@/lib/permissions'
import { PACKAGE_CONFIGS } from '@/lib/config/packages'
import type { PackageType } from '@/types'

export async function createProperty(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Package limit check
  const { data: profile } = await supabase
    .from('profiles')
    .select('package_type')
    .eq('id', user.id)
    .single()

  const pkg = (profile?.package_type as PackageType) ?? 'pack1'
  const pkgConfig = PACKAGE_CONFIGS[pkg]

  const { count: currentCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .is('deleted_at', null)

  if (!canCreateProperty(pkg, currentCount ?? 0)) {
    return {
      error:
        pkgConfig.propertyLimit !== null
          ? `İlan limitinize ulaştınız (${currentCount}/${pkgConfig.propertyLimit}). Paketinizi yükseltin.`
          : 'İlan oluşturulamadı.',
    }
  }

  const raw = Object.fromEntries(formData)
  const parsed = propertySchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const { error } = await supabase.from('properties').insert({
    ...parsed.data,
    user_id: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath('/properties')
  revalidatePath('/dashboard')
  redirect('/properties')
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const raw = Object.fromEntries(formData)
  const parsed = propertySchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const { error } = await supabase
    .from('properties')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/properties')
  revalidatePath(`/properties/${id}`)
  revalidatePath('/dashboard')
  redirect(`/properties/${id}`)
}

export async function deleteProperty(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('properties')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/properties')
  revalidatePath('/dashboard')
  redirect('/properties')
}

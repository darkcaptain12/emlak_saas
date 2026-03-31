import { redirect } from 'next/navigation'
import { createClient } from './supabase/server'
import type { Profile } from '@/types'

/**
 * Server-side utility: Gets the authenticated user and their profile.
 * Redirects to /login if not authenticated.
 * Use this in Server Components and Server Actions.
 */
export async function getAuthenticatedProfile(): Promise<{
  userId: string
  userEmail: string | undefined
  profile: Profile
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const safeProfile: Profile = {
    ...(profile as Profile),
    package_type: (profile as Profile).package_type ?? 'pack1',
    role: (profile as Profile).role ?? 'customer_user',
    is_active: (profile as Profile).is_active ?? true,
  }

  return {
    userId: user.id,
    userEmail: user.email,
    profile: safeProfile,
  }
}

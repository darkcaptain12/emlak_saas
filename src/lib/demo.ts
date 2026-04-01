import { createClient } from '@/lib/supabase/server'

export const DEMO_ERROR = 'Bu bir demo hesabıdır. Veri ekleme, düzenleme ve silme işlemleri devre dışıdır.'

export async function isDemoUser(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_demo')
    .eq('id', user.id)
    .single()

  return profile?.is_demo === true
}

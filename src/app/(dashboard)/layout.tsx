import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/Sidebar'
import { redirect } from 'next/navigation'
import type { Profile } from '@/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let profile: Profile | null = null

  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    profile = data as Profile
  } catch (error) {
    console.error('[Layout] Failed to fetch profile:', error)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar profile={profile} />
      {/* Desktop: offset by sidebar width; Mobile: offset by top bar height */}
      <main className="lg:pl-64 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}

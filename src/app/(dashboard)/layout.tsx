import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/Sidebar'
import type { Profile } from '@/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar profile={null} />
      {/* Desktop: offset by sidebar width; Mobile: offset by top bar height */}
      <main className="lg:pl-64 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}

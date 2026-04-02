'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Building2,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
} from 'lucide-react'
import type { Profile } from '@/types'
import { PACKAGE_CONFIGS } from '@/lib/config/packages'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/properties', label: 'İlanlar', icon: Building2 },
  { href: '/clients', label: 'Müşteriler', icon: Users },
  { href: '/leads', label: 'Müşteri Takip', icon: TrendingUp },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
]

interface SidebarProps {
  profile: Profile | null
}

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const pkg = profile?.package_type ?? 'pack1'
  const pkgConfig = PACKAGE_CONFIGS[pkg]

  const packageBadgeClass =
    pkg === 'pack3'
      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
      : pkg === 'pack2'
      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
      : 'bg-slate-700 text-slate-400 border border-slate-600'

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Home className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white font-semibold text-sm truncate">EmlakCRM</p>
          <p className="text-slate-500 text-xs truncate">
            {profile?.agency_name || 'Gayrimenkul'}
          </p>
        </div>
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1 text-slate-400 hover:text-white"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {profile?.full_name?.[0]?.toUpperCase() || 'E'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate">
              {profile?.full_name || 'Emlakçı'}
            </p>
            <span className={`text-xs px-1.5 py-0.5 rounded ${packageBadgeClass}`}>
              {pkgConfig.name}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Çıkış Yap
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex-col z-50">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 border-b border-slate-800 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
            <Home className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white font-semibold text-sm">EmlakCRM</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
          aria-label="Menü"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative w-72 bg-slate-900 border-r border-slate-800 flex flex-col z-10">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}

import { createClient } from '@/lib/supabase/server'
import { getPropertyLimitStatus, canAccessAdvancedDashboard, canAccessPremiumAnalytics } from '@/lib/permissions'
import { formatCurrency, formatRelativeDate } from '@/lib/utils'
import {
  Building2, Users, TrendingUp, CheckCircle2, MapPin,
  Trophy, XCircle, Tag, BarChart2, ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import PropertyStatusBadge from '@/components/properties/PropertyStatusBadge'
import PackageBanner from '@/components/dashboard/PackageBanner'
import OnboardingCards from '@/components/dashboard/OnboardingCards'
import LeadStatusChart from '@/components/dashboard/LeadStatusChart'
import PropertyTypeChart from '@/components/dashboard/PropertyTypeChart'
import MonthlyLeadChart from '@/components/dashboard/MonthlyLeadChart'
import PropertyStatusChart from '@/components/dashboard/PropertyStatusChart'
import type { Property, Client, PackageType } from '@/types'

const LEAD_STATUS_COLORS: Record<string, string> = {
  new: '#3b82f6',
  contacted: '#eab308',
  viewing: '#f97316',
  offer: '#a855f7',
  won: '#22c55e',
  lost: '#ef4444',
}

const LEAD_STATUS_LABELS: Record<string, string> = {
  new: 'Yeni',
  contacted: 'İletişimde',
  viewing: 'Geziliyor',
  offer: 'Teklif',
  won: 'Kazanıldı',
  lost: 'Kaybedildi',
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: 'Daire',
  house: 'Müstakil',
  land: 'Arsa',
  commercial: 'Ticari',
  other: 'Diğer',
}

const PROPERTY_STATUS_COLORS: Record<string, string> = {
  active: '#22c55e',
  pending: '#eab308',
  sold: '#3b82f6',
  rented: '#a855f7',
  passive: '#475569',
}

const PROPERTY_STATUS_LABELS: Record<string, string> = {
  active: 'Aktif',
  pending: 'Bekliyor',
  sold: 'Satıldı',
  rented: 'Kiralandı',
  passive: 'Pasif',
}

const TR_MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

function computeMonthlyLeads(leads: { created_at: string }[]) {
  const months: Record<string, number> = {}
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months[key] = 0
  }
  for (const lead of leads) {
    const d = new Date(lead.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (key in months) months[key]++
  }
  return Object.entries(months).map(([key, count]) => {
    const month = parseInt(key.split('-')[1]!, 10)
    return { month: TR_MONTHS[month - 1] ?? key, leads: count }
  })
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get profile if user exists
  let pkg: PackageType = 'pack1'
  let agency_name: string | null = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('package_type, agency_name')
      .eq('id', user.id)
      .single()

    if (profile) {
      pkg = profile.package_type || 'pack1'
      agency_name = profile.agency_name
    }
  }

  const showAdvanced = canAccessAdvancedDashboard(pkg)
  const showPremium = canAccessPremiumAnalytics(pkg)

  // Parallel data fetch
  const [
    { data: allProperties },
    { data: allLeads },
    { count: totalClients },
    { data: recentProperties },
    { data: recentClients },
  ] = await Promise.all([
    supabase.from('properties').select('id, status, property_type, title, city, price, currency, created_at').is('deleted_at', null),
    supabase.from('leads').select('id, status, created_at'),
    supabase.from('clients').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('properties').select('*').is('deleted_at', null).order('created_at', { ascending: false }).limit(5),
    showAdvanced
      ? supabase.from('clients').select('*').is('deleted_at', null).order('created_at', { ascending: false }).limit(5)
      : Promise.resolve({ data: null }),
  ])

  const props = allProperties ?? []
  const leads = allLeads ?? []

  // Derived stats
  const totalProperties = props.length
  const activeProperties = props.filter((p) => p.status === 'active').length
  const pendingProperties = props.filter((p) => p.status === 'pending').length
  const soldOrRented = props.filter((p) => p.status === 'sold' || p.status === 'rented').length
  const wonLeads = leads.filter((l) => l.status === 'won').length
  const lostLeads = leads.filter((l) => l.status === 'lost').length
  const openLeads = leads.filter((l) => l.status !== 'won' && l.status !== 'lost').length
  const totalDecidedLeads = wonLeads + lostLeads
  const conversionRate = totalDecidedLeads > 0 ? Math.round((wonLeads / totalDecidedLeads) * 100) : 0

  // Limit check
  const limitStatus = getPropertyLimitStatus(pkg, totalProperties)

  // Chart data
  const leadStatusData = Object.entries(LEAD_STATUS_LABELS).map(([status, name]) => ({
    name,
    value: leads.filter((l) => l.status === status).length,
    color: LEAD_STATUS_COLORS[status] ?? '#475569',
  }))

  const propertyTypeData = Object.entries(PROPERTY_TYPE_LABELS).map(([type, name]) => ({
    name,
    count: props.filter((p) => p.property_type === type).length,
  }))

  const propertyStatusData = Object.entries(PROPERTY_STATUS_LABELS).map(([status, name]) => ({
    name,
    value: props.filter((p) => p.status === status).length,
    color: PROPERTY_STATUS_COLORS[status] ?? '#475569',
  }))

  const monthlyLeadData = showAdvanced ? computeMonthlyLeads(leads) : []

  // Base stats (all packages)
  const baseStats = [
    {
      label: 'Toplam İlan',
      value: totalProperties,
      icon: Building2,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      label: 'Aktif İlan',
      value: activeProperties,
      icon: CheckCircle2,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      label: 'Müşteriler',
      value: totalClients ?? 0,
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      label: 'Açık Lead',
      value: openLeads,
      icon: TrendingUp,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
  ]

  // Advanced stats (pack2+)
  const advancedStats = [
    {
      label: 'Satıldı / Kiralandı',
      value: soldOrRented,
      icon: Tag,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      label: 'Kazanılan Lead',
      value: wonLeads,
      icon: Trophy,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      label: 'Kaybedilen Lead',
      value: lostLeads,
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
    },
    {
      label: 'Dönüşüm Oranı',
      value: `%${conversionRate}`,
      icon: BarChart2,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
  ]

  const hasProperties = totalProperties > 0
  const hasClients = (totalClients ?? 0) > 0
  const hasLeads = leads.length > 0

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            {agency_name
              ? `${agency_name} portföy özeti`
              : 'Portföyünüze genel bakış'}
          </p>
        </div>
        <Link
          href="/packages"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          {pkg === 'pack1' ? 'Başlangıç' : pkg === 'pack2' ? 'Profesyonel' : 'Kurumsal'}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Package banner */}
      <PackageBanner
        packageType={pkg}
        propertyCount={totalProperties}
        limitStatus={limitStatus}
      />

      {/* Onboarding */}
      {(!hasProperties || !hasClients || !hasLeads) && (
        <OnboardingCards
          hasProperties={hasProperties}
          hasClients={hasClients}
          hasLeads={hasLeads}
        />
      )}

      {/* Base Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {baseStats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-slate-900 rounded-xl p-5 border ${stat.border}`}
          >
            <div
              className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Advanced Stats (pack2+) */}
      {showAdvanced && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {advancedStats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-slate-900 rounded-xl p-5 border ${stat.border}`}
            >
              <div
                className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {!showAdvanced && <div className="mb-8" />}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Properties */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <h2 className="text-white font-semibold">Son İlanlar</h2>
            <Link href="/properties" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
              Tümü →
            </Link>
          </div>
          {!recentProperties?.length ? (
            <div className="px-5 py-10 text-center">
              <Building2 className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">Henüz ilan yok</p>
              <Link href="/properties/new" className="text-blue-400 text-xs hover:text-blue-300 mt-1 inline-block">
                İlk ilanı ekle →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {(recentProperties as Property[]).map((p) => (
                <Link
                  key={p.id}
                  href={`/properties/${p.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{p.title}</p>
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <MapPin className="w-3 h-3" />
                      {p.city}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white text-sm font-semibold">
                      {formatCurrency(p.price, p.currency)}
                    </p>
                    <div className="flex justify-end mt-1">
                      <PropertyStatusBadge status={p.status} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Lead Status Chart */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <h2 className="text-white font-semibold">Lead Durumu</h2>
            <Link href="/leads" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
              Tümü →
            </Link>
          </div>
          <div className="px-2 py-3">
            <LeadStatusChart data={leadStatusData} />
          </div>
        </div>
      </div>

      {/* Charts Row 2 — pack2+ */}
      {showAdvanced && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Lead Chart */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <h2 className="text-white font-semibold">Aylık Lead Akışı</h2>
              <p className="text-slate-500 text-xs mt-0.5">Son 6 ay</p>
            </div>
            <div className="px-4 py-4">
              <MonthlyLeadChart data={monthlyLeadData} />
            </div>
          </div>

          {/* Property Type Chart */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <h2 className="text-white font-semibold">İlan Tipi Dağılımı</h2>
              <p className="text-slate-500 text-xs mt-0.5">Tüm ilanlar</p>
            </div>
            <div className="px-4 py-4">
              <PropertyTypeChart data={propertyTypeData} />
            </div>
          </div>
        </div>
      )}

      {/* Row 3 — pack2+ recent clients + pack3 status chart */}
      {showAdvanced && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Clients */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h2 className="text-white font-semibold">Son Müşteriler</h2>
              <Link href="/clients" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                Tümü →
              </Link>
            </div>
            {!recentClients?.length ? (
              <div className="px-5 py-10 text-center">
                <Users className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Henüz müşteri yok</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {(recentClients as Client[]).map((c) => (
                  <Link
                    key={c.id}
                    href={`/clients/${c.id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {c.full_name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{c.full_name}</p>
                      <p className="text-slate-500 text-xs">{c.phone ?? c.email ?? '—'}</p>
                    </div>
                    <span className="text-slate-600 text-xs">{formatRelativeDate(c.created_at)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Property Status Chart — pack3 premium, pack2 lite */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div>
                <h2 className="text-white font-semibold">İlan Durum Dağılımı</h2>
                {showPremium && (
                  <p className="text-xs text-purple-400 mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
                    Kurumsal Analitik
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>{pendingProperties} bekliyor</span>
              </div>
            </div>
            <div className="px-2 py-3">
              <PropertyStatusChart data={propertyStatusData} />
            </div>
          </div>
        </div>
      )}

      {/* Pack1 — simple lead bar */}
      {!showAdvanced && leads.length > 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden mb-6">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <h2 className="text-white font-semibold">Lead Dağılımı</h2>
            <Link href="/leads" className="text-blue-400 text-sm hover:text-blue-300">
              Yönet →
            </Link>
          </div>
          <div className="p-5 space-y-3">
            {Object.entries(LEAD_STATUS_LABELS)
              .filter(([k]) => k !== 'won' && k !== 'lost')
              .map(([status, label]) => {
                const count = leads.filter((l) => l.status === status).length
                const pct = openLeads > 0 ? Math.round((count / openLeads) * 100) : 0
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">{label}</span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: LEAD_STATUS_COLORS[status],
                        }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}

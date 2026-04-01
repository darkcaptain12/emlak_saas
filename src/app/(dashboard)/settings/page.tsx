'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import PageHeader from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  User, Building2, Phone, Mail, Package, CheckCircle,
  ExternalLink, Shield, Calendar,
} from 'lucide-react'
import Link from 'next/link'
import { PACKAGE_CONFIGS, formatPackagePrice } from '@/lib/config/packages'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { formatDate } from '@/lib/utils'
import type { Profile } from '@/types'

export default function SettingsPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ full_name: '', agency_name: '', phone: '' })

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? '')

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data as Profile)
        setForm({
          full_name: data.full_name ?? '',
          agency_name: data.agency_name ?? '',
          phone: data.phone ?? '',
        })
      }
      setLoading(false)
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.full_name.trim()) {
      toast.error('Ad soyad zorunludur')
      return
    }
    setSaving(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('profiles').update(form).eq('id', user.id)
    if (error) {
      toast.error('Kaydedilemedi: ' + error.message)
    } else {
      toast.success('Profil güncellendi')
      setProfile((p) => (p ? { ...p, ...form } : p))
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-900 rounded-xl p-6 border border-slate-800 animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-1/3 mb-4" />
            <div className="space-y-3">
              <div className="h-10 bg-slate-800 rounded" />
              <div className="h-10 bg-slate-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const pkg = profile?.package_type ?? 'pack1'
  const pkgConfig = PACKAGE_CONFIGS[pkg]

  return (
    <div className="max-w-2xl">
      <PageHeader title="Ayarlar" description="Hesap ve profil bilgilerinizi yönetin" />

      {/* ── Profil ── */}
      <form onSubmit={handleSave} className="space-y-6">
        <section className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <h2 className="text-white font-semibold">Profil Bilgileri</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            {/* Avatar hint */}
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {form.full_name[0]?.toUpperCase() || 'E'}
              </div>
              <div>
                <p className="text-white font-medium">{form.full_name || 'Kullanıcı'}</p>
                <p className="text-slate-400 text-sm">{email}</p>
              </div>
            </div>

            <div>
              <Label className="text-slate-300 text-sm">Ad Soyad *</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <Input
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                  className="pl-9 bg-slate-800 border-slate-700 text-white"
                  placeholder="Ahmet Yılmaz"
                />
              </div>
            </div>

            <div>
              <Label className="text-slate-300 text-sm">Ofis / Acente Adı</Label>
              <div className="relative mt-1">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <Input
                  value={form.agency_name}
                  onChange={(e) => setForm((f) => ({ ...f, agency_name: e.target.value }))}
                  className="pl-9 bg-slate-800 border-slate-700 text-white"
                  placeholder="Yılmaz Gayrimenkul"
                />
              </div>
            </div>

            <div>
              <Label className="text-slate-300 text-sm">Telefon</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="pl-9 bg-slate-800 border-slate-700 text-white"
                  placeholder="05xx xxx xx xx"
                />
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-slate-800 flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 min-w-28"
            >
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </Button>
          </div>
        </section>
      </form>

      {/* ── Hesap ── */}
      <section className="mt-6 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
          <Mail className="w-4 h-4 text-slate-400" />
          <h2 className="text-white font-semibold">Hesap Bilgileri</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-400 text-sm">E-posta</span>
            <span className="text-white text-sm font-medium">{email || '—'}</span>
          </div>
          <Separator className="bg-slate-800" />
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-400 text-sm">Hesap Durumu</span>
            <span className={`flex items-center gap-1.5 text-sm font-medium ${profile?.is_active ? 'text-green-400' : 'text-red-400'}`}>
              <span className={`w-2 h-2 rounded-full ${profile?.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
              {profile?.is_active ? 'Aktif' : 'Pasif'}
            </span>
          </div>
          <Separator className="bg-slate-800" />
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-400 text-sm">Rol</span>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-300 text-sm">
                {profile?.role === 'super_admin' ? 'Süper Admin' : 'Kullanıcı'}
              </span>
            </div>
          </div>
          {profile?.created_at && (
            <>
              <Separator className="bg-slate-800" />
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400 text-sm flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Kayıt Tarihi
                </span>
                <span className="text-slate-300 text-sm">{formatDate(profile.created_at)}</span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Paket ── */}
      <section className="mt-6 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-slate-400" />
            <h2 className="text-white font-semibold">Mevcut Paket</h2>
          </div>
          <Badge
            variant="outline"
            className={
              pkg === 'pack3'
                ? 'border-purple-500/50 text-purple-400 bg-purple-500/10'
                : pkg === 'pack2'
                ? 'border-blue-500/50 text-blue-400 bg-blue-500/10'
                : 'border-slate-600 text-slate-300 bg-slate-800'
            }
          >
            {pkgConfig.name}
          </Badge>
        </div>
        <div className="px-6 py-5">
          {/* Price row */}
          <div className="flex items-end gap-1 mb-4">
            <span className="text-2xl font-bold text-white">
              {formatPackagePrice(pkgConfig.priceOneTime)}
            </span>
            <span className="text-slate-400 text-sm mb-0.5">tek seferlik</span>
          </div>
          {pkgConfig.maintenanceFee && (
            <p className="text-slate-600 text-xs mb-5">
              + {formatPackagePrice(pkgConfig.maintenanceFee)}/ay bakım ücreti
            </p>
          )}

          {/* Features */}
          <ul className="space-y-2 mb-5">
            {pkgConfig.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          {/* Package started */}
          {profile?.package_started_at && (
            <p className="text-slate-500 text-xs mb-5">
              Paket başlangıcı: {formatDate(profile.package_started_at)}
            </p>
          )}

          <Separator className="bg-slate-800 mb-5" />

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/packages"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              Paket Karşılaştır
            </Link>
            {pkg !== 'pack3' && (
              <a
                href={buildWhatsAppUrl('upgrade', pkg)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Paketi Yükselt
              </a>
            )}
            {pkg !== 'pack1' && (
              <a
                href={buildWhatsAppUrl('downgrade', pkg)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 text-sm transition-colors"
              >
                Düşürme Talebi
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

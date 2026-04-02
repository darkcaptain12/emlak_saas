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

      {/* ── Mevcut Paket ── */}
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
          <p className="text-slate-400 text-sm mb-4">
            Paket yükseltme, düşürme ve diğer tüm işlemler WhatsApp üzerinden gerçekleştirilmektedir.
          </p>
          <a
            href={buildWhatsAppUrl('info', pkg)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp ile İletişime Geç
          </a>
        </div>
      </section>

    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// WhatsApp numaranı buraya yaz (başında 90 ile, boşluksuz)
const WHATSAPP_NUMBER = '905315661805'

const PACKAGES = [
  {
    id: 'pack1',
    name: 'Başlangıç',
    priceOneTime: 9900,
    maintenanceFee: 990,
    propertyLimit: '20 ilan',
    color: 'slate',
    borderClass: 'border-slate-600 hover:border-slate-400',
    badgeClass: 'bg-slate-700 text-slate-300',
    btnClass: 'bg-slate-700 hover:bg-slate-600 text-white',
    features: [
      'Dashboard temel metrikler',
      'İlan yönetimi (max 20 ilan)',
      'Müşteri yönetimi',
      'Lead takip ve Kanban board',
      'Profil ayarları',
    ],
  },
  {
    id: 'pack2',
    name: 'Profesyonel',
    priceOneTime: 19900,
    maintenanceFee: 1990,
    propertyLimit: '100 ilan',
    highlight: true,
    color: 'blue',
    borderClass: 'border-blue-500 ring-2 ring-blue-500/30',
    badgeClass: 'bg-blue-600 text-white',
    btnClass: 'bg-blue-600 hover:bg-blue-500 text-white',
    features: [
      'Başlangıç\'taki her şey',
      'İlan yönetimi (max 100 ilan)',
      'Gelişmiş dashboard & analitik',
      'Aylık lead akış grafiği',
      'Lead pipeline performans özeti',
    ],
  },
  {
    id: 'pack3',
    name: 'Kurumsal',
    priceOneTime: 39900,
    maintenanceFee: 3990,
    propertyLimit: 'Sınırsız ilan',
    color: 'purple',
    borderClass: 'border-purple-600 hover:border-purple-400',
    badgeClass: 'bg-purple-700 text-purple-200',
    btnClass: 'bg-purple-700 hover:bg-purple-600 text-white',
    features: [
      'Profesyonel\'deki her şey',
      'Sınırsız ilan',
      'Tam gelişmiş raporlama',
      'Premium analytics kartları',
      'Öncelikli destek',
    ],
  },
]

function formatPrice(amount: number) {
  return new Intl.NumberFormat('tr-TR').format(amount)
}

function openWhatsApp(packageName: string) {
  const text = encodeURIComponent(
    `Merhaba, EmlakCRM ${packageName} paketi hakkında bilgi almak ve satın almak istiyorum.`
  )
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank')
}

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('E-posta veya şifre hatalı.')
      setLoading(false)
      return
    }

    router.refresh()
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div>
            <span className="text-white font-bold text-lg">EmlakCRM</span>
            <span className="text-slate-400 text-xs block -mt-1">Emlakçılar için profesyonel CRM</span>
          </div>
        </div>
        <div className="text-slate-400 text-sm">
          Zaten hesabınız var mı?{' '}
          <button
            onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Giriş yapın
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="text-center pt-12 pb-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Gayrimenkul işlerinizi<br />
          <span className="text-blue-400">profesyonelce yönetin</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          İlanlarınızı, müşterilerinizi ve leadlerinizi tek platformdan takip edin. Paketinizi seçin, hemen başlayın.
        </p>
      </div>

      {/* Package Cards */}
      <div className="px-4 pb-16 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-slate-800 rounded-2xl border p-6 flex flex-col transition-all duration-200 ${pkg.borderClass}`}
            >
              {pkg.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    En Popüler
                  </span>
                </div>
              )}

              <div className={`inline-flex items-center self-start px-2.5 py-1 rounded-md text-xs font-medium mb-4 ${pkg.badgeClass}`}>
                {pkg.propertyLimit}
              </div>

              <h3 className="text-white font-bold text-xl mb-1">{pkg.name}</h3>

              <div className="mb-1">
                <span className="text-3xl font-bold text-white">₺{formatPrice(pkg.priceOneTime)}</span>
                <span className="text-slate-400 text-sm ml-1">tek seferlik</span>
              </div>
              <p className="text-slate-600 text-xs mb-5">
                + ₺{formatPrice(pkg.maintenanceFee)}/yıl bakım ücreti
              </p>

              <ul className="space-y-2 mb-6 flex-1">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                    <svg className="w-4 h-4 text-green-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => openWhatsApp(pkg.name)}
                className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors ${pkg.btnClass}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Kullanmaya Başla
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800" />

      {/* Login Section */}
      <div id="login-section" className="flex items-center justify-center py-14 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h2 className="text-white text-xl font-bold">Hesabınıza Giriş Yapın</h2>
            <p className="text-slate-400 text-sm mt-1">Paketiniz aktif edildikten sonra giriş yapabilirsiniz</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@gmail.com"
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

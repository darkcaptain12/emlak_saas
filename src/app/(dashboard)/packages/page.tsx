import { createClient } from '@/lib/supabase/server'
import { MessageCircle } from 'lucide-react'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { PACKAGE_CONFIGS } from '@/lib/config/packages'
import type { PackageType } from '@/types'

export default async function PackagesPage() {
  const supabase = await createClient()

  // Get current user and package type
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let pkg: PackageType = 'pack1'

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('package_type')
      .eq('id', user.id)
      .single()

    if (profile) {
      pkg = profile.package_type || 'pack1'
    }
  }

  const pkgConfig = PACKAGE_CONFIGS[pkg]

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">Paketler</h1>
        <p className="text-slate-400">
          Mevcut planınız:{' '}
          <span className="text-white font-semibold">{pkgConfig.name}</span>
        </p>
        <p className="text-slate-500 text-sm mt-1">
          {pkgConfig.propertyLimit === null
            ? 'Sınırsız ilan'
            : `Max ${pkgConfig.propertyLimit} ilan`}
        </p>
      </div>

      {/* WhatsApp Support Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-2">Paket Değişikliği</h2>
            <p className="text-slate-400 text-sm mb-4">
              Paket yükseltme, düşürme ve diğer tüm işlemler WhatsApp üzerinden gerçekleştirilmektedir.
              Aşağıdaki butondan hazır mesajla bizimle iletişime geçebilirsiniz.
              İşlemler genellikle 1 iş günü içinde tamamlanır.
            </p>
            <a
              href={buildWhatsAppUrl('info', pkg)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-6 rounded-xl transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp ile İletişime Geç
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

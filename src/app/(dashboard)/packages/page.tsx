import { getAuthenticatedProfile } from '@/lib/auth'
import PackageComparison from '@/components/packages/PackageComparison'
import { Package, MessageCircle } from 'lucide-react'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { PACKAGE_CONFIGS } from '@/lib/config/packages'

export default async function PackagesPage() {
  const { profile } = await getAuthenticatedProfile()
  const pkg = profile.package_type
  const pkgConfig = PACKAGE_CONFIGS[pkg]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-5 h-5 text-slate-400" />
          <h1 className="text-2xl font-bold text-white">Paketler</h1>
        </div>
        <p className="text-slate-400 text-sm">
          Mevcut planınız:{' '}
          <span className="text-white font-medium">{pkgConfig.name}</span>
          {' · '}
          {pkgConfig.propertyLimit === null
            ? 'Sınırsız ilan'
            : `Max ${pkgConfig.propertyLimit} ilan`}
        </p>
      </div>

      {/* Package comparison */}
      <PackageComparison currentPackage={pkg} />

      {/* Info footer */}
      <div className="mt-10 p-6 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MessageCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">Paket değişikliği hakkında</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Paket yükseltme ve düşürme işlemleri WhatsApp üzerinden gerçekleştirilmektedir.
              Yukarıdaki butonlara tıklayarak hazır mesajla bizimle iletişime geçebilirsiniz.
              İşlemler genellikle 1 iş günü içinde tamamlanır.
            </p>
            <a
              href={buildWhatsAppUrl('info', pkg)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Bilgi almak için WhatsApp&apos;tan yazın
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

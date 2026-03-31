'use client'

import Link from 'next/link'
import { AlertTriangle, Zap, ArrowRight } from 'lucide-react'
import type { PackageType } from '@/types'
import type { PropertyLimitStatus } from '@/lib/permissions'
import { PACKAGE_CONFIGS } from '@/lib/config/packages'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

interface PackageBannerProps {
  packageType: PackageType
  propertyCount: number
  limitStatus: PropertyLimitStatus
}

export default function PackageBanner({
  packageType,
  propertyCount,
  limitStatus,
}: PackageBannerProps) {
  const config = PACKAGE_CONFIGS[packageType]
  const limit = config.propertyLimit

  if (limitStatus === 'full') {
    return (
      <div className="flex items-center justify-between gap-4 px-4 py-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/30">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">
            <span className="font-semibold">İlan limitine ulaştınız</span>
            {limit !== null && (
              <span className="text-red-400"> ({propertyCount}/{limit})</span>
            )}
            {' — '}Yeni ilan eklemek için paketinizi yükseltin.
          </p>
        </div>
        <a
          href={buildWhatsAppUrl('upgrade', packageType)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors whitespace-nowrap"
        >
          <Zap className="w-3 h-3" />
          Yükselt
        </a>
      </div>
    )
  }

  if (limitStatus === 'warning') {
    return (
      <div className="flex items-center justify-between gap-4 px-4 py-3 mb-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-300">
            <span className="font-semibold">Limite yaklaşıyorsunuz</span>
            {limit !== null && (
              <span className="text-amber-400"> ({propertyCount}/{limit} ilan)</span>
            )}
            {' — '}Planı yükseltmeyi düşünün.
          </p>
        </div>
        <Link
          href="/packages"
          className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-xs font-medium transition-colors whitespace-nowrap"
        >
          Planları Gör <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    )
  }

  return null
}

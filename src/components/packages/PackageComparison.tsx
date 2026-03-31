'use client'

import { Check, Zap, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PackageType } from '@/types'
import { PACKAGE_CONFIGS, formatPackagePrice } from '@/lib/config/packages'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

interface PackageComparisonProps {
  currentPackage: PackageType
}

export default function PackageComparison({ currentPackage }: PackageComparisonProps) {
  const packages = Object.values(PACKAGE_CONFIGS)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {packages.map((pkg) => {
        const isCurrent = pkg.id === currentPackage
        const isUpgrade =
          (currentPackage === 'pack1' && (pkg.id === 'pack2' || pkg.id === 'pack3')) ||
          (currentPackage === 'pack2' && pkg.id === 'pack3')
        const isDowngrade =
          (currentPackage === 'pack3' && (pkg.id === 'pack1' || pkg.id === 'pack2')) ||
          (currentPackage === 'pack2' && pkg.id === 'pack1')

        return (
          <div
            key={pkg.id}
            className={cn(
              'relative flex flex-col rounded-2xl p-6 border transition-all',
              isCurrent
                ? 'bg-blue-600/10 border-blue-500/50'
                : pkg.highlight
                ? 'bg-slate-800/60 border-slate-600'
                : 'bg-slate-900 border-slate-800'
            )}
          >
            {/* Badge */}
            {pkg.highlight && !isCurrent && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold whitespace-nowrap">
                En Popüler
              </div>
            )}
            {isCurrent && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold whitespace-nowrap">
                Mevcut Planınız
              </div>
            )}

            {/* Header */}
            <div className="mb-6">
              <h3 className="text-white font-bold text-lg">{pkg.name}</h3>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-3xl font-extrabold text-white">
                  {formatPackagePrice(pkg.priceMonthly)}
                </span>
                <span className="text-slate-400 text-sm mb-1">/ay</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                {pkg.propertyLimit === null
                  ? 'Sınırsız ilan'
                  : `Max ${pkg.propertyLimit} ilan`}
              </p>
            </div>

            {/* Features */}
            <ul className="flex-1 space-y-3 mb-8">
              {pkg.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            {isCurrent ? (
              <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                <Check className="w-4 h-4" />
                Aktif Plan
              </div>
            ) : isUpgrade ? (
              <a
                href={buildWhatsAppUrl('upgrade', currentPackage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
              >
                <Zap className="w-4 h-4" />
                Bu Plana Geç
              </a>
            ) : isDowngrade ? (
              <a
                href={buildWhatsAppUrl('downgrade', currentPackage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Düşürme Talebi
              </a>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

import type { PackageType } from '@/types'

export interface PackageConfig {
  id: PackageType
  name: string
  priceOneTime: number
  maintenanceFee?: number
  propertyLimit: number | null
  highlight?: boolean
  features: string[]
  color: string
}

export const PACKAGE_CONFIGS: Record<PackageType, PackageConfig> = {
  pack1: {
    id: 'pack1',
    name: 'Başlangıç',
    priceOneTime: 9900,
    maintenanceFee: 990,
    propertyLimit: 20,
    color: 'slate',
    features: [
      'Dashboard temel metrikler',
      'İlan yönetimi (max 20 ilan)',
      'Müşteri yönetimi',
      'Lead takip ve Kanban board',
      'Profil ayarları',
      'Temel grafikler',
    ],
  },
  pack2: {
    id: 'pack2',
    name: 'Profesyonel',
    priceOneTime: 19900,
    maintenanceFee: 1990,
    propertyLimit: 100,
    highlight: true,
    color: 'blue',
    features: [
      'Pack1\'deki tüm özellikler',
      'İlan yönetimi (max 100 ilan)',
      'Gelişmiş dashboard & analitik',
      'Aylık lead akış grafiği',
      'İlan tip dağılım grafiği',
      'Lead pipeline performans özeti',
      'Müşteri & ilan istatistikleri',
      'Son aktiviteler bölümü',
    ],
  },
  pack3: {
    id: 'pack3',
    name: 'Kurumsal',
    priceOneTime: 39900,
    maintenanceFee: 3990,
    propertyLimit: null,
    color: 'purple',
    features: [
      'Pack2\'deki tüm özellikler',
      'Sınırsız ilan',
      'Tam gelişmiş raporlama',
      'Premium analytics kartları',
      'İlan durum dağılım grafiği',
      'Dönüşüm oranı analizi',
      'Çoklu kullanıcı altyapısı (yakında)',
      'Öncelikli destek',
    ],
  },
}

export const PACKAGE_NAMES: Record<PackageType, string> = {
  pack1: 'Başlangıç',
  pack2: 'Profesyonel',
  pack3: 'Kurumsal',
}

export function formatPackagePrice(priceMonthly: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(priceMonthly)
}

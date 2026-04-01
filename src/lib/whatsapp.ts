import type { PackageType } from '@/types'
import { PACKAGE_NAMES } from './config/packages'

export type WhatsAppMessageType = 'upgrade' | 'downgrade' | 'info'

export function generateWhatsAppPackageMessage(
  type: WhatsAppMessageType,
  currentPackage: PackageType
): string {
  const name = PACKAGE_NAMES[currentPackage] ?? currentPackage

  const messages: Record<WhatsAppMessageType, string> = {
    upgrade: `Merhaba, mevcut paketimi yükseltmek istiyorum. Şu anki paketim: ${name}.`,
    downgrade: `Merhaba, mevcut paketimi düşürmek istiyorum. Şu anki paketim: ${name}.`,
    info: `Merhaba, paket detayları hakkında bilgi almak istiyorum. Şu anki paketim: ${name}.`,
  }

  return messages[type]
}

export function buildWhatsAppUrl(
  type: WhatsAppMessageType,
  currentPackage: PackageType
): string {
  const number =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') ?? '905315661805'
  const message = generateWhatsAppPackageMessage(type, currentPackage)
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

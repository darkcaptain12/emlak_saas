import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'TRY'): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeDate(date: string): string {
  const now = new Date()
  const target = new Date(date)
  const diffMs = now.getTime() - target.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Bugün'
  if (diffDays === 1) return 'Dün'
  if (diffDays < 7) return `${diffDays} gün önce`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay önce`
  return `${Math.floor(diffDays / 365)} yıl önce`
}

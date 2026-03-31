import { Badge } from '@/components/ui/badge'
import type { PropertyStatus } from '@/types'

const STATUS_MAP: Record<PropertyStatus, { label: string; className: string }> = {
  active:  { label: 'Aktif',    className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  pending: { label: 'Bekliyor', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  sold:    { label: 'Satıldı',  className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  rented:  { label: 'Kiralık',  className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  passive: { label: 'Pasif',    className: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
}

export default function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  const { label, className } = STATUS_MAP[status] || STATUS_MAP.passive
  return <Badge variant="outline" className={className}>{label}</Badge>
}

import Link from 'next/link'
import { buttonVariants } from '@/lib/button-variants'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  action?: { label: string; href: string }
  icon?: React.ReactNode
}

export default function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && <div className="text-slate-600 mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm max-w-sm mb-6">{description}</p>
      {action && (
        <Link href={action.href} className={cn(buttonVariants(), 'bg-blue-600 hover:bg-blue-700')}>
          <Plus className="w-4 h-4 mr-2" />
          {action.label}
        </Link>
      )}
    </div>
  )
}

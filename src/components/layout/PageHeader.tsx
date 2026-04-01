import Link from 'next/link'
import { buttonVariants } from '@/lib/button-variants'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    href: string
  }
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && <p className="text-slate-400 text-sm mt-1">{description}</p>}
      </div>
      {action && (
        <Link href={action.href} className={cn(buttonVariants(), 'bg-blue-600 hover:bg-blue-700')}>
          <Plus className="w-4 h-4 mr-2" />
          {action.label}
        </Link>
      )}
    </div>
  )
}

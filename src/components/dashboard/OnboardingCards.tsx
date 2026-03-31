import Link from 'next/link'
import { Building2, Users, TrendingUp, ArrowRight } from 'lucide-react'

interface OnboardingCardsProps {
  hasProperties: boolean
  hasClients: boolean
  hasLeads: boolean
}

const steps = [
  {
    key: 'properties' as const,
    title: 'İlk ilanını ekle',
    description: 'Portföyünüzü oluşturmak için bir ilan ekleyin.',
    href: '/properties/new',
    icon: Building2,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    key: 'clients' as const,
    title: 'İlk müşterini ekle',
    description: 'Alıcı, satıcı veya kiracılarınızı kaydedin.',
    href: '/clients/new',
    icon: Users,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    key: 'leads' as const,
    title: 'İlk lead\'ini oluştur',
    description: 'Müşteri ilgilerini pipeline\'ınızda takip edin.',
    href: '/leads/new',
    icon: TrendingUp,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
]

export default function OnboardingCards({
  hasProperties,
  hasClients,
  hasLeads,
}: OnboardingCardsProps) {
  const statusMap = {
    properties: hasProperties,
    clients: hasClients,
    leads: hasLeads,
  }

  const pendingSteps = steps.filter((s) => !statusMap[s.key])

  if (pendingSteps.length === 0) return null

  return (
    <div className="mb-8">
      <p className="text-slate-400 text-sm mb-3">Başlamak için şunları yapın:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {pendingSteps.map((step) => (
          <Link
            key={step.key}
            href={step.href}
            className={`flex items-start gap-4 p-4 rounded-xl bg-slate-900 border ${step.border} hover:border-slate-600 transition-colors group`}
          >
            <div className={`w-9 h-9 rounded-lg ${step.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <step.icon className={`w-4 h-4 ${step.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">{step.title}</p>
              <p className="text-slate-500 text-xs mt-0.5">{step.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors mt-0.5 flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}

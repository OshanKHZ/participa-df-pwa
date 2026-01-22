'use client'

import { useRouter } from 'next/navigation'
import {
  RiArrowLeftLine,
  RiSearchLine,
  RiCustomerService2Line,
  RiQuestionLine,
  RiBarChartBoxLine,
  RiFileTextLine,
  RiTimeLine,
  RiShieldCheckLine,
  RiMapPinLine,
  RiPhoneLine,
  RiArrowRightSLine,
} from 'react-icons/ri'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'

export default function ServicosPage() {
  const router = useRouter()

  const services = [
    {
      id: 'consultar',
      title: 'Consultar protocolo',
      icon: RiSearchLine,
      href: '/historico',
    },
    {
      id: 'canais',
      title: 'Canais de atendimento',
      icon: RiCustomerService2Line,
      href: '/canais',
    },
    {
      id: 'ajuda',
      title: 'Perguntas frequentes',
      icon: RiQuestionLine,
      href: '/ajuda',
    },
    {
      id: 'transparencia',
      title: 'Transparência',
      icon: RiBarChartBoxLine,
      href: '/transparencia',
    },
    {
      id: 'legislacao',
      title: 'Legislação',
      icon: RiFileTextLine,
      href: '#',
    },
    {
      id: 'prazos',
      title: 'Prazos',
      icon: RiTimeLine,
      href: '#',
    },
    {
      id: 'privacidade',
      title: 'Privacidade',
      icon: RiShieldCheckLine,
      href: '#',
    },
    {
      id: 'atendimento',
      title: 'Atendimento Presencial',
      icon: RiMapPinLine,
      href: '#',
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-header">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Voltar"
            >
              <RiArrowLeftLine className="size-5 text-white/70" />
            </button>
            <h1 className="text-lg font-semibold">Serviços</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4">
        {/* Services List - Single Column */}
        <div className="border border-border rounded-lg divide-y divide-border bg-card">
          {services.map(service => {
            const Icon = service.icon
            return (
              <button
                key={service.id}
                onClick={() =>
                  service.href !== '#' && router.push(service.href)
                }
                className={`w-full flex items-center gap-3 p-3.5 text-left transition-colors ${
                  service.href !== '#'
                    ? 'hover:bg-accent'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                disabled={service.href === '#'}
              >
                <Icon className="size-5 text-secondary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">
                    {service.title}
                  </span>
                </div>
                {service.href !== '#' && (
                  <RiArrowRightSLine className="size-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>

        {/* Quick Contact */}
        <div className="mt-4 bg-muted rounded-lg p-4">
          <div className="flex items-center gap-3">
            <RiPhoneLine className="size-5 text-secondary flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-0.5">
                Precisa de ajuda?
              </p>
              <a
                href="tel:162"
                className="text-sm font-semibold text-secondary hover:underline"
              >
                162
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <MobileBottomNav activeTab="services" />
    </div>
  )
}

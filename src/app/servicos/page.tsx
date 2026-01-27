'use client'

import { useRouter } from 'next/navigation'
import {
  RiSearchLine,
  RiCustomerService2Line,
  RiQuestionLine,
  RiBarChartBoxLine,
  RiPhoneLine,
  RiArrowRightSLine,
  RiMegaphoneLine,
  RiLightbulbLine,
} from 'react-icons/ri'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'
import { HomeMobileHeader } from '@/shared/components/HomeMobileHeader'
import { DesktopHeader } from '@/shared/components/DesktopHeader'

export default function ServicosPage() {
  const router = useRouter()

  const services = [
    {
      id: 'sobre',
      title: 'Sobre a Ouvidoria',
      icon: RiMegaphoneLine,
      href: '/o-que-e-ouvidoria',
    },
    {
      id: 'orientacoes',
      title: 'Orientações para o registro',
      icon: RiLightbulbLine,
      href: '/orientacoes',
    },
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
  ]

  return (
    <>
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Header */}
      <HomeMobileHeader />

      <div className="min-h-screen bg-background pb-20 md:pb-6 lg:max-w-6xl lg:mx-auto">
        {/* Content */}
        <main className="px-4 py-4">
          <h1 className="text-xl font-semibold text-foreground mb-4">
            Serviços
          </h1>
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
                  className={`w-full flex items-center gap-3 p-3.5 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-inset ${
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
        <MobileBottomNav activeTab="services" isAuthenticated={false} />
      </div>
    </>
  )
}

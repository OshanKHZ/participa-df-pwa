'use client'

import { useRouter } from 'next/navigation'
import {
  RiSearchLine,
  RiCustomerService2Line,
  RiQuestionLine,
  RiBarChartBoxLine,
  RiPhoneLine,
  RiMegaphoneLine,
  RiLightbulbLine,
} from 'react-icons/ri'
import { HomeMobileHeader } from '@/shared/components/HomeMobileHeader'
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'
import { ServiceCard } from './components/ServiceCard'

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
      href: '/consultar-manifestacoes',
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
        <main className="px-4 py-4 lg:py-8">
          <h1 className="text-xl lg:text-2xl font-semibold text-foreground mb-4 lg:mb-6">
            Serviços
          </h1>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {services.map(service => (
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.title}
                onClick={() =>
                  service.href !== '#' && router.push(service.href)
                }
                disabled={service.href === '#'}
              />
            ))}
          </div>

          {/* Quick Contact */}
          <div className="mt-4 lg:mt-6 bg-muted rounded-lg p-4 lg:p-5">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
              <RiPhoneLine className="size-5 lg:size-6 text-secondary flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-0.5 lg:gap-2">
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    Precisa de ajuda?
                  </p>
                  <a
                    href="tel:162"
                    className="text-sm lg:text-base font-semibold text-secondary hover:underline"
                  >
                    162
                  </a>
                </div>
                <div className="flex flex-col gap-0.5 mt-1 lg:mt-0.5">
                  <p className="text-xs text-muted-foreground">
                    Seg a Sex das 8h às 20h
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Fins de semana e feriados das 9h às 14h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Navigation - Mobile only */}
        <div className="md:hidden">
          <MobileBottomNav activeTab="services" isAuthenticated={false} />
        </div>
      </div>
    </>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  RiArrowLeftLine,
  RiMegaphoneLine,
  RiCustomerService2Line,
  RiPhoneLine,
  RiArrowRightSLine,
} from 'react-icons/ri'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'

const channels = [
  {
    id: 'participa',
    title: 'Participa DF',
    description: 'Ouv-DF (Sistema de Ouvidoria)',
    icon: RiMegaphoneLine,
  },
  {
    id: '162',
    title: 'Central 162',
    description: 'Seg a sex: 7h às 21h. Fins de semana e feriados: 8h às 18h',
    icon: RiPhoneLine,
  },
  {
    id: 'presencial',
    title: 'Presencial',
    description: 'Nos órgãos do GDF. Confira horários e agendamento.',
    icon: RiCustomerService2Line,
  },
]

export default function OQueEOuvidoriaPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-header">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="size-9 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Voltar"
            >
              <RiArrowLeftLine className="size-6" />
            </button>
            <h1 className="text-lg font-semibold">Sobre a Ouvidoria</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Intro Section */}
        <section className="mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            A Ouvidoria é um espaço para você se relacionar com o Governo do Distrito
            Federal, registrando sua solicitação, reclamação, elogio, denúncia ou
            pedido de informação que tenha relação com os serviços prestados pelo
            Governo. É dessa forma que vamos garantir que você seja ouvido.
          </p>
        </section>

        {/* Channels Section */}
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Canais de atendimento
          </h3>

          <div className="space-y-3">
            {channels.map((channel) => {
              const Icon = channel.icon
              return (
                <div
                  key={channel.id}
                  className="flex items-center gap-3 p-3.5 bg-card border border-border rounded-lg"
                >
                  <Icon className="size-5 text-secondary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground mb-0.5">
                      {channel.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {channel.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Network Section */}
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Rede de Ouvidorias
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            As ouvidorias do GDF formam a rede que faz parte do Sistema de Gestão de
            Ouvidoria do Distrito Federal - SIGO/DF, coordenado pela Ouvidoria-Geral
            do DF.
          </p>
        </section>

        {/* CTA Section */}
        <section className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
          <p className="text-sm text-foreground mb-2">
            Tem alguma dúvida?
          </p>
          <Link
            href="/ajuda"
            className="inline-flex items-center gap-2 text-secondary font-medium text-sm hover:underline"
          >
            Acessar Perguntas Frequentes
            <RiArrowRightSLine className="size-4" />
          </Link>
        </section>
      </main>

      {/* Bottom Navigation */}
      <MobileBottomNav activeTab="home" isAuthenticated={false} />
    </div>
  )
}

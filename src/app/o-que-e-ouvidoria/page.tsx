'use client'

import Link from 'next/link'
import {
  RiMegaphoneLine,
  RiCustomerService2Line,
  RiPhoneLine,
  RiArrowRightSLine,
} from 'react-icons/ri'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'
import { MobileHeader } from '@/shared/components/MobileHeader'

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
    description:
      'Seg a Sex das 8h às 20h\nFins de semana e feriados das 9h às 14h',
    icon: RiPhoneLine,
  },
  {
    id: 'presencial',
    title: 'Presencial',
    description: 'Nos órgãos do GDF.',
    linkText: 'Confira horários e endereços',
    href: 'https://ouvidoria.df.gov.br/texto-endereco-das-ouvidorias/',
    icon: RiCustomerService2Line,
  },
]

export default function OQueEOuvidoriaPage() {
  return (
    <>
      <MobileHeader title="Sobre a Ouvidoria" />

      <div className="min-h-screen bg-background pb-20 md:pb-6">
        {/* Main Content */}
        <main className="px-4 py-6">
          {/* Intro Section */}
          <section className="mb-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              A Ouvidoria é um espaço para você se relacionar com o Governo do
              Distrito Federal, registrando sua solicitação, reclamação, elogio,
              denúncia ou pedido de informação que tenha relação com os serviços
              prestados pelo Governo. É dessa forma que vamos garantir que você
              seja ouvido.
            </p>
          </section>

          {/* Channels Section */}
          <section className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Canais de atendimento
            </h3>

            <div className="space-y-3">
              {channels.map(channel => {
                const Icon = channel.icon
                const Wrapper = channel.href ? 'a' : 'div'
                const wrapperProps = channel.href
                  ? {
                      href: channel.href,
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    }
                  : {}

                return (
                  <Wrapper
                    key={channel.id}
                    {...wrapperProps}
                    className="flex items-center gap-3 p-3.5 bg-card border border-border rounded-lg"
                  >
                    <Icon className="size-5 text-secondary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground mb-0.5">
                        {channel.title}
                      </h4>
                      {channel.href ? (
                        <p className="text-xs text-muted-foreground">
                          {channel.description}{' '}
                          <span className="text-secondary underline">
                            {channel.linkText}
                          </span>
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground whitespace-pre-line">
                          {channel.description}
                        </p>
                      )}
                    </div>
                  </Wrapper>
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
              As ouvidorias do GDF formam a rede que faz parte do Sistema de
              Gestão de Ouvidoria do Distrito Federal - SIGO/DF, coordenado pela
              Ouvidoria-Geral do DF.
            </p>
          </section>

          {/* CTA Section */}
          <section className="bg-primary rounded-md p-4">
            <p className="text-sm text-white mb-2">Tem alguma dúvida?</p>
            <Link
              href="/ajuda"
              className="inline-flex items-center gap-2 text-white font-medium text-sm underline"
            >
              Acessar Perguntas Frequentes
              <RiArrowRightSLine className="size-4" />
            </Link>
          </section>
        </main>

        {/* Bottom Navigation */}
        <MobileBottomNav activeTab="home" isAuthenticated={false} />
      </div>
    </>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  RiMegaphoneLine,
  RiCustomerService2Line,
  RiPhoneLine,
  RiArrowRightSLine,
} from 'react-icons/ri'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'
import { MobileHeader } from '@/shared/components/MobileHeader'
import { DesktopHeader } from '@/shared/components/DesktopHeader'

const channels = [
  {
    id: 'participa',
    title: 'Participa DF',
    description: 'Ouv-DF (Sistema de Ouvidoria)',
    linkText: 'Nova manifestação',
    href: '/manifestacao',
    isInternal: true,
    icon: RiMegaphoneLine,
  },
  {
    id: '162',
    title: 'Central 162',
    description:
      'Seg a Sex das 8h às 20h · Fins de semana e feriados das 9h às 14h',
    linkText: 'Ligar agora',
    href: 'tel:162',
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
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Header */}
      <MobileHeader title="Sobre a Ouvidoria" />

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-background pb-20">
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
                const content = (
                  <>
                    <Icon className="size-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground">
                        {channel.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {channel.description}
                      </p>
                      <span className="text-xs text-secondary underline mt-1 inline-block">
                        {channel.linkText}
                      </span>
                    </div>
                  </>
                )

                if (channel.isInternal) {
                  return (
                    <Link
                      key={channel.id}
                      href={channel.href}
                      className="flex items-start gap-3 p-3.5 bg-card border border-border rounded-lg hover:border-secondary/50 transition-colors"
                    >
                      {content}
                    </Link>
                  )
                }

                return (
                  <a
                    key={channel.id}
                    href={channel.href}
                    target={
                      channel.href.startsWith('http') ? '_blank' : undefined
                    }
                    rel={
                      channel.href.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="flex items-start gap-3 p-3.5 bg-card border border-border rounded-lg hover:border-secondary/50 transition-colors"
                  >
                    {content}
                  </a>
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

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen bg-background pb-12">
        <main className="max-w-3xl mx-auto px-8 py-10">
          {/* Header */}
          <div className="mb-8 flex items-start gap-6">
            <Image
              src="/logos/Logo-OUV.svg"
              alt="Logo da Ouvidoria do Governo do Distrito Federal"
              width={280}
              height={162}
              className="flex-shrink-0"
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-3">
                O que é a Ouvidoria?
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                A Ouvidoria é um espaço para você se relacionar com o Governo do
                Distrito Federal, registrando sua solicitação, reclamação,
                elogio, denúncia ou pedido de informação que tenha relação com
                os serviços prestados pelo Governo. É dessa forma que vamos
                garantir que você seja ouvido.
              </p>
            </div>
          </div>

          {/* Canais de atendimento */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
              Canais de atendimento
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {channels.map(channel => {
                const Icon = channel.icon
                const content = (
                  <div className="flex flex-col items-center text-center p-5 h-full">
                    <div className="size-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
                      <Icon className="size-6 text-secondary" />
                    </div>
                    <span className="font-medium text-foreground mb-1">
                      {channel.title}
                    </span>
                    <p className="text-sm text-muted-foreground mb-3 flex-1">
                      {channel.description}
                    </p>
                    <span className="text-sm text-secondary underline">
                      {channel.linkText}
                    </span>
                  </div>
                )

                if (channel.isInternal) {
                  return (
                    <Link
                      key={channel.id}
                      href={channel.href}
                      className="border border-border rounded-lg hover:border-secondary/50 transition-colors"
                    >
                      {content}
                    </Link>
                  )
                }

                return (
                  <a
                    key={channel.id}
                    href={channel.href}
                    target={
                      channel.href.startsWith('http') ? '_blank' : undefined
                    }
                    rel={
                      channel.href.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="border border-border rounded-lg hover:border-secondary/50 transition-colors"
                  >
                    {content}
                  </a>
                )
              })}
            </div>
          </section>

          <hr className="border-border mb-8" />

          {/* Rede de Ouvidorias */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
              Rede de Ouvidorias
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              As ouvidorias do GDF formam a rede que faz parte do Sistema de
              Gestão de Ouvidoria do Distrito Federal - SIGO/DF, coordenado pela
              Ouvidoria-Geral do DF.
            </p>
          </section>

          {/* CTA */}
          <div className="flex items-center justify-between p-5 bg-primary rounded-lg">
            <div>
              <p className="text-white font-medium">Tem alguma dúvida?</p>
              <p className="text-white/70 text-sm">
                Confira as perguntas frequentes
              </p>
            </div>
            <Link
              href="/ajuda"
              className="inline-flex items-center gap-2 bg-white text-primary font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition-colors text-sm"
            >
              Acessar FAQ
              <RiArrowRightSLine className="size-4" />
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}

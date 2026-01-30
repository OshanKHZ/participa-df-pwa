'use client'

import Link from 'next/link'
import { RiTimeLine, RiArrowRightSLine } from 'react-icons/ri'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'
import { MobileHeader } from '@/shared/components/MobileHeader'
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { ChannelCard } from '@/shared/components/ChannelCard'
import { channels } from '@/shared/data/channels'
import { generateContactPageSchema } from '@/lib/seo/schemas'

export default function CanaisPage() {
  const contactSchema = generateContactPageSchema()

  return (
    <>
      {/* Contact Page Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Header */}
      <MobileHeader title="Canais de Atendimento" />

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-background pb-20">
        <main className="px-4 py-6">
          {/* Intro */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Escolha o canal de atendimento mais conveniente para você. Estamos
              disponíveis para ouvir suas manifestações, dúvidas e sugestões.
            </p>
          </div>

          {/* Channels */}
          <div className="space-y-4">
            {channels.map(channel => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-8 mb-6">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <RiTimeLine className="size-5 text-primary" />
              Prazo de Resposta
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Todas as manifestações são respondidas em até 30 dias úteis,
              conforme a legislação vigente. Você pode acompanhar o andamento
              pelo número de protocolo.
            </p>
          </div>

          {/* Help Box */}
          <div className="mt-4 bg-muted border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">
              Precisa de ajuda?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Se você tiver dúvidas sobre como fazer uma manifestação, consulte
              nossa seção de{' '}
              <Link
                href="/ajuda"
                className="text-secondary font-medium hover:underline"
              >
                Perguntas Frequentes
              </Link>
              .
            </p>
          </div>
        </main>

        {/* Bottom Navigation */}
        <MobileBottomNav activeTab="services" isAuthenticated={false} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen bg-background pb-12">
        <main className="max-w-3xl mx-auto px-8 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-3">
              Canais de Atendimento
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Escolha o canal de atendimento mais conveniente para você. Estamos
              disponíveis para ouvir suas manifestações, dúvidas e sugestões.
            </p>
          </div>

          {/* Channels Grid */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
              Canais disponíveis
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {channels.map((channel, index) => {
                const Icon = channel.icon
                const isLastAndOdd =
                  index === channels.length - 1 && channels.length % 2 === 1
                return (
                  <div
                    key={channel.id}
                    className={`bg-card border border-border rounded-lg overflow-hidden hover:border-secondary/50 transition-colors ${isLastAndOdd ? 'col-span-2' : ''}`}
                  >
                    <div className="bg-primary-light p-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Icon className="size-5 text-white" />
                        <h3 className="font-semibold text-white text-sm">
                          {channel.title}
                        </h3>
                      </div>
                    </div>
                    <div
                      className={`p-4 ${isLastAndOdd ? 'grid grid-cols-2 gap-x-6 gap-y-2' : 'space-y-2'}`}
                    >
                      {channel.items.map((item, idx) => (
                        <div key={idx}>
                          <p className="text-xs text-muted-foreground">
                            {item.label}
                          </p>
                          {'link' in item && item.link ? (
                            <a
                              href={item.link}
                              target={
                                item.link.startsWith('http')
                                  ? '_blank'
                                  : undefined
                              }
                              rel={
                                item.link.startsWith('http')
                                  ? 'noopener noreferrer'
                                  : undefined
                              }
                              className="text-sm font-medium text-secondary hover:underline"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-sm font-medium text-foreground">
                              {item.value}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <hr className="border-border mb-8" />

          {/* Info Box */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
              <RiTimeLine className="size-5 text-primary" />
              Prazo de Resposta
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Todas as manifestações são respondidas em até 30 dias úteis,
              conforme a legislação vigente. Você pode acompanhar o andamento
              pelo número de protocolo.
            </p>
          </section>

          {/* CTA */}
          <div className="flex items-center justify-between p-5 bg-success rounded-lg">
            <div>
              <p className="text-white font-medium">Precisa de ajuda?</p>
              <p className="text-white/70 text-sm">
                Confira as perguntas frequentes
              </p>
            </div>
            <Link
              href="/ajuda"
              className="inline-flex items-center gap-2 bg-white text-success font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition-colors text-sm"
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

'use client'

import { useRouter } from 'next/navigation'
import { RiTimeLine } from 'react-icons/ri'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'
import { MobileHeader } from '@/shared/components/MobileHeader'
import { ChannelCard } from '@/shared/components/ChannelCard'
import { channels } from '@/shared/data/channels'

export default function CanaisPage() {
  const router = useRouter()

  return (
    <>
      <MobileHeader title="Canais de Atendimento" />

      <div className="min-h-screen bg-background pb-20 md:pb-6">
        {/* Content */}
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
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <RiTimeLine className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Prazo de Resposta
                </h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Todas as manifestações são respondidas em até 30 dias úteis,
                  conforme a legislação vigente. Você pode acompanhar o
                  andamento pelo número de protocolo.
                </p>
              </div>
            </div>
          </div>

          {/* Help Box */}
          <div className="mt-4 bg-muted border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">
              Precisa de ajuda?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Se você tiver dúvidas sobre como fazer uma manifestação, consulte
              nossa seção de{' '}
              <button
                onClick={() => router.push('/ajuda')}
                className="text-secondary font-medium hover:underline"
              >
                Perguntas Frequentes
              </button>
              .
            </p>
          </div>
        </main>

        {/* Bottom Navigation */}
        <MobileBottomNav activeTab="services" isAuthenticated={false} />
      </div>
    </>
  )
}

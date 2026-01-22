'use client'

import Link from 'next/link'
import { RiSearchLine, RiQuestionLine, RiBarChartBoxLine } from 'react-icons/ri'
import { ChannelCard } from '@/shared/components/ChannelCard'
import { channels } from '@/shared/data/channels'
import { TransparenciaPopover } from '@/shared/components/TransparenciaPopover'

interface DesktopSidebarProps {
  isTransparenciaOpen: boolean
  onTransparenciaToggle: () => void
  transparenciaTriggerRef: React.RefObject<HTMLElement>
}

export function DesktopSidebar({
  isTransparenciaOpen,
  onTransparenciaToggle,
  transparenciaTriggerRef,
}: DesktopSidebarProps) {
  return (
    <aside className="hidden lg:block fixed left-8 top-32 bottom-8 w-80 z-header">
      <div className="sticky top-0 space-y-4">
        {/* Quick Actions Card */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="bg-primary-light p-4 border-b border-border">
            <h3 className="font-semibold text-white text-sm">Acesso Rápido</h3>
          </div>
          <div className="p-3 space-y-1">
            <Link
              href="/historico"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm"
            >
              <RiSearchLine className="size-4 text-secondary" />
              <span className="text-foreground font-medium">
                Consultar Protocolo
              </span>
            </Link>
            <div className="relative">
              <button
                ref={transparenciaTriggerRef as React.RefObject<HTMLButtonElement>}
                onClick={onTransparenciaToggle}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm w-full text-left"
              >
                <RiBarChartBoxLine className="size-4 text-secondary" />
                <span className="text-foreground font-medium">Transparência</span>
              </button>
              <TransparenciaPopover
                isOpen={isTransparenciaOpen}
                onClose={onTransparenciaToggle}
                triggerRef={transparenciaTriggerRef}
              />
            </div>
            <Link
              href="/ajuda"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm"
            >
              <RiQuestionLine className="size-4 text-secondary" />
              <span className="text-foreground font-medium">
                Perguntas Frequentes
              </span>
            </Link>
          </div>
        </div>

        {/* Channels Card */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="bg-primary-light p-4 border-b border-border">
            <h3 className="font-semibold text-white text-sm">
              Canais de Atendimento
            </h3>
          </div>
          <div className="p-3 space-y-2 max-h-channel-list overflow-y-auto">
            {channels.map(channel => (
              <ChannelCard key={channel.id} channel={channel} compact />
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

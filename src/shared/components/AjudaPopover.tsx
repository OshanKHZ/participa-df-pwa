'use client'

import Link from 'next/link'
import { BasePopover } from './BasePopover'

interface AjudaPopoverProps {
  isOpen: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement | null>
}

export function AjudaPopover({
  isOpen,
  onClose,
  triggerRef,
}: AjudaPopoverProps) {
  return (
    <BasePopover isOpen={isOpen} onClose={onClose} triggerRef={triggerRef}>
      <Link
        href="/o-que-e-ouvidoria"
        className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
        onClick={onClose}
      >
        <div>
          <h4 className="text-base font-medium text-white">Sobre a Ouvidoria</h4>
          <p className="text-sm text-white/60 mt-0.5">Conheça o papel da ouvidoria</p>
        </div>
      </Link>

      <Link
        href="/ajuda"
        className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
        onClick={onClose}
      >
        <div>
          <h4 className="text-base font-medium text-white">Perguntas Frequentes</h4>
          <p className="text-sm text-white/60 mt-0.5">Tire suas dúvidas</p>
        </div>
      </Link>

      <Link
        href="/canais"
        className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
        onClick={onClose}
      >
        <div>
          <h4 className="text-base font-medium text-white">Canais de Atendimento</h4>
          <p className="text-sm text-white/60 mt-0.5">Telefone, presencial e outros</p>
        </div>
      </Link>
    </BasePopover>
  )
}

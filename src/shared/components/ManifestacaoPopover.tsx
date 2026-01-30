'use client'

import Link from 'next/link'
import { BasePopover } from './BasePopover'

interface ManifestacaoPopoverProps {
  isOpen: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement | null>
}

export function ManifestacaoPopover({
  isOpen,
  onClose,
  triggerRef,
}: ManifestacaoPopoverProps) {
  return (
    <BasePopover isOpen={isOpen} onClose={onClose} triggerRef={triggerRef}>
      <Link
        href="/manifestacao"
        className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
        onClick={onClose}
        role="menuitem"
      >
        <div>
          <h4 className="text-base font-medium text-white">Nova Manifestação</h4>
          <p className="text-sm text-white/60 mt-0.5">Registre sua manifestação</p>
        </div>
      </Link>

      <Link
        href="/consultar-manifestacoes"
        className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
        onClick={onClose}
        role="menuitem"
      >
        <div>
          <h4 className="text-base font-medium text-white">Acompanhar Registro</h4>
          <p className="text-sm text-white/60 mt-0.5">Consulte seus protocolos</p>
        </div>
      </Link>

      <Link
        href="/orientacoes"
        className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
        onClick={onClose}
        role="menuitem"
      >
        <div>
          <h4 className="text-base font-medium text-white">Orientações</h4>
          <p className="text-sm text-white/60 mt-0.5">Como registrar sua manifestação</p>
        </div>
      </Link>
    </BasePopover>
  )
}

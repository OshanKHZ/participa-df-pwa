'use client'

import { RiExternalLinkLine } from 'react-icons/ri'
import { BasePopover } from './BasePopover'

interface TransparenciaPopoverProps {
  isOpen: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement | null>
}

export function TransparenciaPopover({
  isOpen,
  onClose,
  triggerRef,
}: TransparenciaPopoverProps) {
  return (
    <BasePopover isOpen={isOpen} onClose={onClose} triggerRef={triggerRef}>
      <a
        href="http://www.painel.ouv.df.gov.br/dashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
        onClick={onClose}
        role="menuitem"
      >
        <div>
          <h4 className="text-base font-medium text-white">Painel de Ouvidoria</h4>
          <p className="text-sm text-white/60 mt-0.5">Dashboard de manifestações</p>
        </div>
        <RiExternalLinkLine className="size-4 text-white/50 flex-shrink-0" />
      </a>

      <a
        href="https://app.powerbi.com/view?r=eyJrIjoiZTg3ZGM2NDktNDA3Yy00ZDBiLWE2ZmItNzJmMTRkNjRjZjk0IiwidCI6IjU3NGNhYTRiLTkxODEtNGI5Yy04ZDhhLTBiMGY3NjkwZDdmNiJ9"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
        onClick={onClose}
        role="menuitem"
      >
        <div>
          <h4 className="text-base font-medium text-white">Transparência Passiva</h4>
          <p className="text-sm text-white/60 mt-0.5">Acesso à informação</p>
        </div>
        <RiExternalLinkLine className="size-4 text-white/50 flex-shrink-0" />
      </a>

      <a
        href="http://www.transparencia.df.gov.br/#/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
        onClick={onClose}
        role="menuitem"
      >
        <div>
          <h4 className="text-base font-medium text-white">Portal da Transparência</h4>
          <p className="text-sm text-white/60 mt-0.5">Receitas e despesas</p>
        </div>
        <RiExternalLinkLine className="size-4 text-white/50 flex-shrink-0" />
      </a>

      <a
        href="http://www.dados.df.gov.br/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
        onClick={onClose}
        role="menuitem"
      >
        <div>
          <h4 className="text-base font-medium text-white">Portal de Dados Abertos</h4>
          <p className="text-sm text-white/60 mt-0.5">Conjuntos de dados</p>
        </div>
        <RiExternalLinkLine className="size-4 text-white/50 flex-shrink-0" />
      </a>
    </BasePopover>
  )
}

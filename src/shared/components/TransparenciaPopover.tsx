'use client'

import { useEffect, useRef } from 'react'
import { RiExternalLinkLine } from 'react-icons/ri'

interface TransparenciaPopoverProps {
  isOpen: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement>
}

export function TransparenciaPopover({
  isOpen,
  onClose,
  triggerRef,
}: TransparenciaPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, onClose, triggerRef])

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      onClose()
    }, 100)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (!isOpen) return null

  return (
    <div
      ref={popoverRef}
      className="absolute top-full left-0 mt-0 w-56 bg-primary-light shadow-lg z-popover overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Links */}
      <div className="divide-y divide-white/10">
        {/* Painel de Ouvidoria */}
        <a
          href="http://www.painel.ouv.df.gov.br/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
          onClick={onClose}
        >
          <div>
            <h4 className="text-sm font-medium text-white">
              Painel de Ouvidoria
            </h4>
            <p className="text-xs text-white/60 mt-0.5">
              Dashboard de manifestações
            </p>
          </div>
          <RiExternalLinkLine className="size-4 text-white/50 flex-shrink-0" />
        </a>

        {/* Painel de Transparência Passiva */}
        <a
          href="https://app.powerbi.com/view?r=eyJrIjoiZTg3ZGM2NDktNDA3Yy00ZDBiLWE2ZmItNzJmMTRkNjRjZjk0IiwidCI6IjU3NGNhYTRiLTkxODEtNGI5Yy04ZDhhLTBiMGY3NjkwZDdmNiJ9"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
          onClick={onClose}
        >
          <div>
            <h4 className="text-sm font-medium text-white">
              Transparência Passiva
            </h4>
            <p className="text-xs text-white/60 mt-0.5">Acesso à informação</p>
          </div>
          <RiExternalLinkLine className="size-4 text-white/50 flex-shrink-0" />
        </a>

        {/* Portal da Transparência */}
        <a
          href="http://www.transparencia.df.gov.br/#/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
          onClick={onClose}
        >
          <div>
            <h4 className="text-sm font-medium text-white">
              Portal da Transparência
            </h4>
            <p className="text-xs text-white/60 mt-0.5">Receitas e despesas</p>
          </div>
          <RiExternalLinkLine className="size-4 text-white/50 flex-shrink-0" />
        </a>

        {/* Portal de Dados Abertos */}
        <a
          href="http://www.dados.df.gov.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
          onClick={onClose}
        >
          <div>
            <h4 className="text-sm font-medium text-white">
              Portal de Dados Abertos
            </h4>
            <p className="text-xs text-white/60 mt-0.5">Conjuntos de dados</p>
          </div>
          <RiExternalLinkLine className="size-4 text-white/50 flex-shrink-0" />
        </a>
      </div>
    </div>
  )
}

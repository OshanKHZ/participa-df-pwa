'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

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
      className="absolute top-full right-0 mt-0 w-64 bg-primary-light shadow-lg z-popover overflow-hidden rounded-b-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="divide-y divide-white/10">
        <Link
          href="/o-que-e-ouvidoria"
          className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
          onClick={onClose}
        >
          <div>
            <h4 className="text-sm font-medium text-white">
              Sobre a Ouvidoria
            </h4>
            <p className="text-xs text-white/60 mt-0.5">
              Conheça o papel da ouvidoria
            </p>
          </div>
        </Link>

        <Link
          href="/ajuda"
          className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
          onClick={onClose}
        >
          <div>
            <h4 className="text-sm font-medium text-white">
              Perguntas Frequentes
            </h4>
            <p className="text-xs text-white/60 mt-0.5">
              Tire suas dúvidas
            </p>
          </div>
        </Link>

        <Link
          href="/canais"
          className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
          onClick={onClose}
        >
          <div>
            <h4 className="text-sm font-medium text-white">
              Canais de Atendimento
            </h4>
            <p className="text-xs text-white/60 mt-0.5">
              Telefone, presencial e outros
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}

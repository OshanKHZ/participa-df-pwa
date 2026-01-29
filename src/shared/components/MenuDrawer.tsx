'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useFocusTrap } from '@/shared/hooks/useFocusTrap'
import { LinkButton } from '@/shared/components/Button'
import {
  RiCloseLine,
  RiUserLine,
  RiLoginBoxLine,
  RiQuestionLine,
  RiBarChartBoxLine,
  RiSettings4Line,
  RiCustomerService2Line,
  RiFileListLine,
} from 'react-icons/ri'

interface MenuDrawerProps {
  isOpen: boolean
  onClose: () => void
  isAuthenticated?: boolean
  userName?: string
}

export function MenuDrawer({
  isOpen,
  onClose,
  isAuthenticated = false,
  userName,
}: MenuDrawerProps) {
  const containerRef = useFocusTrap(isOpen)

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-dropdown transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={containerRef}
        className={`fixed top-0 right-0 h-full w-80 drawer-width-mobile bg-background z-drawer shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Fechar menu"
          >
            <RiCloseLine className="size-6" />
          </button>
        </div>

        {/* User Section */}
        <div className="border-b border-border p-4">
          {isAuthenticated ? (
            <Link
              href="/perfil"
              onClick={onClose}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <RiUserLine className="size-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">Ver perfil</p>
              </div>
            </Link>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Acesse sua conta para acompanhar suas manifestações
              </p>
              <LinkButton
                href="/entrar"
                variant="secondary"
                onClick={onClose}
                className="w-full py-2.5"
              >
                <RiLoginBoxLine className="size-5" />
                Acessar
              </LinkButton>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/consultar-manifestacoes"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-foreground"
              >
                <RiFileListLine className="size-5 text-muted-foreground" />
                <span className="font-medium text-sm">
                  Minhas Manifestações
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/ajuda"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-foreground"
              >
                <RiQuestionLine className="size-5 text-muted-foreground" />
                <span className="font-medium text-sm">Central de Ajuda</span>
              </Link>
            </li>
            <li>
              <Link
                href="/canais"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-foreground"
              >
                <RiCustomerService2Line className="size-5 text-muted-foreground" />
                <span className="font-medium text-sm">
                  Canais de Atendimento
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/transparencia"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-foreground"
              >
                <RiBarChartBoxLine className="size-5 text-muted-foreground" />
                <span className="font-medium text-sm">Transparência</span>
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link
                  href="/perfil"
                  onClick={onClose}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-foreground"
                >
                  <RiSettings4Line className="size-5 text-muted-foreground" />
                  <span className="font-medium text-sm">Configurações</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
          <p className="text-xs text-muted-foreground text-center">
            Participa DF - Ouvidoria
            <br />
            Versão 1.0.0
          </p>
        </div>
      </div>
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'
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
  RiDownloadLine,
  RiLogoutBoxRLine,
} from 'react-icons/ri'
import { PiPersonArmsSpreadFill } from 'react-icons/pi'
import { getSessionData, logout } from '@/app/actions/auth'

interface MenuDrawerProps {
  isOpen: boolean
  onClose: () => void
  isAuthenticated?: boolean
  userName?: string
  showInstallButton?: boolean
  onInstall?: () => void
}

export function MenuDrawer({
  isOpen,
  onClose,
  isAuthenticated = false,
  userName,
  showInstallButton = false,
  onInstall,
}: MenuDrawerProps) {
  const containerRef = useFocusTrap(isOpen)
  const [internalSession, setInternalSession] = useState<{ name?: string | null; email?: string | null } | null>(null)

  useEffect(() => {
    getSessionData().then(user => {
      if (user) setInternalSession(user)
    })
  }, [])

  const handleLogout = async () => {
    await logout()
    window.location.reload()
  }

  const finalIsAuthenticated = isAuthenticated || !!internalSession
  const finalUserName = userName || internalSession?.name

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
          className="fixed inset-0 bg-black/50 z-drawer transition-opacity"
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
          {finalIsAuthenticated ? (
            <div className="space-y-4">
              <Link
                href="/perfil"
                onClick={onClose}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <RiUserLine className="size-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground leading-tight">{finalUserName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Cidadão • Ver perfil</p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 bg-destructive text-white hover:bg-destructive/90 rounded-lg transition-all text-sm font-medium shadow-sm"
              >
                <RiLogoutBoxRLine className="size-4" />
                Sair da conta
              </button>
            </div>
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
            {/* Install App Button */}
            {showInstallButton && onInstall && (
              <li>
                <button
                  onClick={() => {
                    onInstall()
                    onClose()
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-foreground"
                >
                  <RiDownloadLine className="size-5 text-muted-foreground" />
                  <span className="font-medium text-sm">Instalar App</span>
                </button>
              </li>
            )}

            <li>
              <Link
                href="/consultar-manifestacoes"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-foreground"
              >
                <RiFileListLine className="size-5 text-muted-foreground" />
                <span className="font-medium text-sm">Acompanhar Registro</span>
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
            {finalIsAuthenticated && (
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background space-y-4">
          <LinkButton
            href="#"
            variant="accent"
            onClick={(e) => {
              e.preventDefault()
              // Handle accessibility menu trigger here if needed
            }}
            className="w-full py-2.5 rounded-lg"
          >
            <PiPersonArmsSpreadFill className="size-5" />
            Acessibilidade
          </LinkButton>
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

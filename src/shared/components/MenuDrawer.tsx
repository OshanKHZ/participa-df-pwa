'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import {
  RiCloseLine,
  RiUserLine,
  RiLoginBoxLine,
  RiUserAddLine,
  RiHomeLine,
  RiQuestionLine,
  RiFileTextLine,
  RiSettings4Line,
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
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <RiUserLine className="size-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">Ver perfil</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">
                Entre ou cadastre-se para acompanhar suas manifestações
              </p>
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full bg-secondary hover:bg-secondary-hover text-secondary-foreground font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                <RiLoginBoxLine className="size-5" />
                Entrar
              </Link>
              <button
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full bg-card hover:bg-accent text-foreground font-medium py-2.5 px-4 rounded-lg border border-border transition-colors"
              >
                <RiUserAddLine className="size-5" />
                Cadastrar-se
              </button>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-foreground"
              >
                <RiHomeLine className="size-5 text-muted-foreground" />
                <span className="font-medium">Início</span>
              </Link>
            </li>
            <li>
              <Link
                href="/ajuda"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-foreground"
              >
                <RiQuestionLine className="size-5 text-muted-foreground" />
                <span className="font-medium">Central de Ajuda</span>
              </Link>
            </li>
            <li>
              <button
                onClick={onClose}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-foreground"
              >
                <RiFileTextLine className="size-5 text-muted-foreground" />
                <span className="font-medium">Minhas Manifestações</span>
              </button>
            </li>
            {isAuthenticated && (
              <li>
                <button
                  onClick={onClose}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-foreground"
                >
                  <RiSettings4Line className="size-5 text-muted-foreground" />
                  <span className="font-medium">Configurações</span>
                </button>
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

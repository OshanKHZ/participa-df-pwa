'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import {
  RiLoginBoxLine,
  RiArrowDownSLine,
  RiUserLine,
  RiLogoutBoxRLine,
} from 'react-icons/ri'
import { TransparenciaPopover } from '@/shared/components/TransparenciaPopover'
import { ManifestacaoPopover } from '@/shared/components/ManifestacaoPopover'
import { AjudaPopover } from '@/shared/components/AjudaPopover'
import { getSessionData, logout } from '@/app/actions/auth'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'

export function DesktopHeader() {
  const pathname = usePathname()
  const [isTransparenciaOpen, setIsTransparenciaOpen] = useState(false)
  const [isManifestacaoOpen, setIsManifestacaoOpen] = useState(false)
  const [isAjudaOpen, setIsAjudaOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const transparenciaTriggerRef = useRef<HTMLButtonElement>(null)
  const manifestacaoTriggerRef = useRef<HTMLButtonElement>(null)
  const ajudaTriggerRef = useRef<HTMLButtonElement>(null)
  const [session, setSession] = useState<{
    name?: string | null
    email?: string | null
  } | null>(null)

  useEffect(() => {
    getSessionData().then(user => {
      if (user) setSession(user)
    })
  }, [])

  const handleLogout = () => {
    setShowLogoutDialog(true)
  }

  const confirmLogout = async () => {
    await logout()
    window.location.reload()
  }

  const isActive = (path: string) => pathname === path

  const navLinkClass = (path: string, startsWith = false) =>
    `px-5 py-2 text-base font-normal transition-all border-b-2 ${
      startsWith
        ? pathname?.startsWith(path)
          ? 'text-white border-white'
          : 'text-white/70 border-transparent hover:text-white hover:border-white/30'
        : isActive(path)
          ? 'text-white border-white'
          : 'text-white/70 border-transparent hover:text-white hover:border-white/30'
    }`

  return (
    <>
      <header className="hidden lg:block sticky top-0 z-dropdown">
        {/* Top Layer - Dark (Primary) */}
        <div className="bg-primary">
          <div className="max-w-6xl mx-auto px-8 py-5 grid grid-cols-3 items-center">
            {/* Logo GDF - Left */}
            <div className="justify-self-start">
              <Link
                href="https://www.cg.df.gov.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-90 transition-opacity"
              >
                <Image
                  src="/logo-gdf-branca.png"
                  alt="Governo do Distrito Federal"
                  width={140}
                  height={46}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Logo Participa DF - Center */}
            <div className="justify-self-center">
              <Link
                href="/"
                className="flex-shrink-0 hover:opacity-90 transition-opacity"
              >
                <Image
                  src="/logo.svg"
                  alt="Participa DF"
                  width={320}
                  height={72}
                  priority
                />
              </Link>
            </div>

            {/* Login/Session - Right */}
            <div className="justify-self-end mr-12">
              {session ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                      <RiUserLine className="size-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none">
                        {session.name}
                      </span>
                      <span className="text-xs text-white/60 leading-tight">
                        Cidadão
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 bg-destructive text-white hover:bg-destructive/90 rounded-lg transition-all cursor-pointer shadow-sm"
                    title="Sair"
                  >
                    <RiLogoutBoxRLine className="size-5" />
                  </button>
                </div>
              ) : (
                <Link
                  href={`/entrar?callbackUrl=${encodeURIComponent(pathname)}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
                >
                  <RiLoginBoxLine className="size-5" />
                  <span className="font-medium">Acessar</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Layer - Lighter Blue (Primary Light) */}
        <div className="bg-primary-light">
          <div className="max-w-6xl mx-auto px-8">
            <nav className="flex items-center justify-center gap-1">
              <Link href="/" className={navLinkClass('/')}>
                Início
              </Link>
              <div className="h-4 w-px bg-white/20 mx-2" />
              <div
                className="relative"
                onMouseEnter={() => setIsManifestacaoOpen(true)}
                onMouseLeave={() => setIsManifestacaoOpen(false)}
              >
                <button
                  ref={manifestacaoTriggerRef}
                  onClick={() => setIsManifestacaoOpen(!isManifestacaoOpen)}
                  className={`flex items-center gap-1 px-5 py-2 text-base font-normal transition-all border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-light ${
                    pathname?.startsWith('/manifestacao') ||
                    pathname?.startsWith('/orientacoes')
                      ? 'text-white border-white'
                      : 'text-white/70 border-transparent hover:text-white hover:border-white/30'
                  }`}
                  aria-expanded={isManifestacaoOpen}
                  aria-haspopup="menu"
                  onKeyDown={e => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault()
                      if (isManifestacaoOpen) {
                        const first = (
                          e.currentTarget.nextElementSibling as HTMLElement
                        )?.querySelector('a, button') as HTMLElement
                        first?.focus()
                      } else {
                        setIsManifestacaoOpen(true)
                      }
                    }
                  }}
                >
                  <span>Manifestações</span>
                  <RiArrowDownSLine className="size-3" />
                </button>

                <ManifestacaoPopover
                  isOpen={isManifestacaoOpen}
                  onClose={() => setIsManifestacaoOpen(false)}
                  triggerRef={manifestacaoTriggerRef}
                />
              </div>

              <div className="h-4 w-px bg-white/20 mx-2" />

              <div
                className="relative"
                onMouseEnter={() => setIsAjudaOpen(true)}
                onMouseLeave={() => setIsAjudaOpen(false)}
              >
                <button
                  ref={ajudaTriggerRef}
                  onClick={() => setIsAjudaOpen(!isAjudaOpen)}
                  className={`flex items-center gap-1 px-5 py-2 text-base font-normal transition-all border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-light ${
                    pathname?.startsWith('/ajuda') ||
                    pathname?.startsWith('/o-que-e-ouvidoria') ||
                    pathname?.startsWith('/canais')
                      ? 'text-white border-white'
                      : 'text-white/70 border-transparent hover:text-white hover:border-white/30'
                  }`}
                  aria-expanded={isAjudaOpen}
                  aria-haspopup="menu"
                  onKeyDown={e => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault()
                      if (isAjudaOpen) {
                        const first = (
                          e.currentTarget.nextElementSibling as HTMLElement
                        )?.querySelector('a, button') as HTMLElement
                        first?.focus()
                      } else {
                        setIsAjudaOpen(true)
                      }
                    }
                  }}
                >
                  <span>Ajuda</span>
                  <RiArrowDownSLine className="size-3" />
                </button>

                <AjudaPopover
                  isOpen={isAjudaOpen}
                  onClose={() => setIsAjudaOpen(false)}
                  triggerRef={ajudaTriggerRef}
                />
              </div>

              <div className="h-4 w-px bg-white/20 mx-2" />

              <div
                className="relative"
                onMouseEnter={() => setIsTransparenciaOpen(true)}
                onMouseLeave={() => setIsTransparenciaOpen(false)}
              >
                <button
                  ref={transparenciaTriggerRef}
                  onClick={() => setIsTransparenciaOpen(!isTransparenciaOpen)}
                  className={`flex items-center gap-1 px-5 py-2 text-base font-normal transition-all border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-light ${
                    pathname?.startsWith('/transparencia')
                      ? 'text-white border-white'
                      : 'text-white/70 border-transparent hover:text-white hover:border-white/30'
                  }`}
                  aria-expanded={isTransparenciaOpen}
                  aria-haspopup="menu"
                  onKeyDown={e => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault()
                      if (isTransparenciaOpen) {
                        const first = (
                          e.currentTarget.nextElementSibling as HTMLElement
                        )?.querySelector('a, button') as HTMLElement
                        first?.focus()
                      } else {
                        setIsTransparenciaOpen(true)
                      }
                    }
                  }}
                >
                  <span>Transparência</span>
                  <RiArrowDownSLine className="size-3" />
                </button>

                <TransparenciaPopover
                  isOpen={isTransparenciaOpen}
                  onClose={() => setIsTransparenciaOpen(false)}
                  triggerRef={transparenciaTriggerRef}
                />
              </div>
            </nav>
          </div>
        </div>
      </header>

      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
        title="Confirmar saída"
        message="Deseja realmente sair da sua conta?"
        confirmText="Sair"
        cancelText="Voltar"
        variant="destructive"
      />
    </>
  )
}

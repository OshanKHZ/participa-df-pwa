'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useRef } from 'react'
import { RiAddLine, RiUserLine, RiArrowDownSLine } from 'react-icons/ri'
import { TransparenciaPopover } from '@/shared/components/TransparenciaPopover'

export function DesktopHeader() {
  const pathname = usePathname()
  const [isTransparenciaOpen, setIsTransparenciaOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const transparenciaTriggerRef = useRef<HTMLButtonElement>(null)

  const isActive = (path: string) => pathname === path

  const navLinkClass = (path: string, startsWith = false) =>
    `px-5 py-2 text-sm font-normal transition-all border-b-2 ${
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
          <div className="px-8 py-4 flex items-center justify-between">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.svg"
                alt="Participa DF"
                width={160}
                height={41}
                priority
              />
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsAuthOpen(!isAuthOpen)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
                aria-expanded={isAuthOpen}
                aria-haspopup="true"
              >
                <RiUserLine className="size-4" />
                <span>Entrar / Cadastrar</span>
              </button>

              {isAuthOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white shadow-lg border border-border py-1 min-w-[180px]">
                  <Link
                    href="/entrar"
                    className="block px-5 py-3 text-sm font-medium text-foreground hover:bg-accent hover:text-secondary transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastrar"
                    className="block px-5 py-3 text-sm font-medium text-foreground hover:bg-accent hover:text-secondary transition-colors"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Layer - Lighter Blue (Primary Light) */}
        <div className="bg-primary-light">
          <div className="px-8">
            <nav className="flex items-center justify-center gap-1">
              <Link
                href="/manifestacao"
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-manifestation-cta text-white -my-3 hover:bg-gray-200 hover:text-secondary transition-all duration-200 cursor-pointer"
              >
                <RiAddLine className="size-4" />
                <span>Nova Manifestação</span>
              </Link>

              <Link href="/" className={navLinkClass('/')}>
                Início
              </Link>

              <Link
                href="/servicos"
                className={navLinkClass('/servicos', true)}
              >
                Serviços
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setIsTransparenciaOpen(true)}
                onMouseLeave={() => setIsTransparenciaOpen(false)}
              >
                <button
                  ref={transparenciaTriggerRef}
                  onClick={() => setIsTransparenciaOpen(!isTransparenciaOpen)}
                  className={`flex items-center gap-1 px-5 py-2 text-sm font-normal transition-all border-b-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded ${
                    pathname?.startsWith('/transparencia')
                      ? 'text-white border-white'
                      : 'text-white/70 border-transparent hover:text-white hover:border-white/30'
                  }`}
                  aria-expanded={isTransparenciaOpen}
                  aria-haspopup="true"
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

              <Link href="/ajuda" className={navLinkClass('/ajuda', true)}>
                Ajuda
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useRef } from 'react'
import { RiUserLine, RiArrowDownSLine } from 'react-icons/ri'
import { TransparenciaPopover } from '@/shared/components/TransparenciaPopover'
import { ManifestacaoPopover } from '@/shared/components/ManifestacaoPopover'
import { AjudaPopover } from '@/shared/components/AjudaPopover'

export function DesktopHeader() {
  const pathname = usePathname()
  const [isTransparenciaOpen, setIsTransparenciaOpen] = useState(false)
  const [isManifestacaoOpen, setIsManifestacaoOpen] = useState(false)
  const [isAjudaOpen, setIsAjudaOpen] = useState(false)
  const transparenciaTriggerRef = useRef<HTMLButtonElement>(null)
  const manifestacaoTriggerRef = useRef<HTMLButtonElement>(null)
  const ajudaTriggerRef = useRef<HTMLButtonElement>(null)

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

            <Link
              href="/entrar"
              className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
            >
              <RiUserLine className="size-4" />
              <span>Acessar</span>
            </Link>
          </div>
        </div>

        {/* Bottom Layer - Lighter Blue (Primary Light) */}
        <div className="bg-primary-light">
          <div className="px-8">
            <nav className="flex items-center justify-center gap-1">
              <Link href="/" className={navLinkClass('/')}>
                Início
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setIsManifestacaoOpen(true)}
                onMouseLeave={() => setIsManifestacaoOpen(false)}
              >
                <button
                  ref={manifestacaoTriggerRef}
                  onClick={() => setIsManifestacaoOpen(!isManifestacaoOpen)}
                  className={`flex items-center gap-1 px-5 py-2 text-sm font-normal transition-all border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-light ${
                    pathname?.startsWith('/manifestacao') ||
                    pathname?.startsWith('/orientacoes')
                      ? 'text-white border-white'
                      : 'text-white/70 border-transparent hover:text-white hover:border-white/30'
                  }`}
                  aria-expanded={isManifestacaoOpen}
                  aria-haspopup="true"
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



              <div
                className="relative"
                onMouseEnter={() => setIsAjudaOpen(true)}
                onMouseLeave={() => setIsAjudaOpen(false)}
              >
                <button
                  ref={ajudaTriggerRef}
                  onClick={() => setIsAjudaOpen(!isAjudaOpen)}
                  className={`flex items-center gap-1 px-5 py-2 text-sm font-normal transition-all border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-light ${
                    pathname?.startsWith('/ajuda') ||
                    pathname?.startsWith('/o-que-e-ouvidoria') ||
                    pathname?.startsWith('/canais')
                      ? 'text-white border-white'
                      : 'text-white/70 border-transparent hover:text-white hover:border-white/30'
                  }`}
                  aria-expanded={isAjudaOpen}
                  aria-haspopup="true"
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

              <div
                className="relative"
                onMouseEnter={() => setIsTransparenciaOpen(true)}
                onMouseLeave={() => setIsTransparenciaOpen(false)}
              >
                <button
                  ref={transparenciaTriggerRef}
                  onClick={() => setIsTransparenciaOpen(!isTransparenciaOpen)}
                  className={`flex items-center gap-1 px-5 py-2 text-sm font-normal transition-all border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-light ${
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
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}

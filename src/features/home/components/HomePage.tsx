'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  RiAddLine,
  RiArrowRightSLine,
  RiMegaphoneLine,
  RiCustomerService2Line,
  RiSearchLine,
  RiQuestionLine,
  RiMenuLine,
  RiLightbulbLine,
} from 'react-icons/ri'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'
import { MenuDrawer } from '@/shared/components/MenuDrawer'
import { DesktopHeader } from '@/shared/components/DesktopHeader'

interface HomePageProps {
  isAuthenticated?: boolean
  userName?: string
}

export function HomePage({ isAuthenticated, userName }: HomePageProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Header */}
      <header className="lg:hidden bg-primary text-primary-foreground">
        <div className="px-3 py-3 flex items-center justify-between">
          <Image
            src="/logo.svg"
            alt="Participa DF"
            width={126}
            height={32}
            priority
            className="h-7 w-auto"
          />
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Menu"
          >
            <RiMenuLine className="size-6 text-white" />
          </button>
        </div>

        {/* Slogan Section */}
        <div className="bg-primary-light px-4 py-2.5">
          <p className="text-center text-xs font-medium text-white">
            Você no controle!
          </p>
        </div>
      </header>

      {/* Menu Drawer */}
      <MenuDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        isAuthenticated={isAuthenticated}
        userName={userName}
      />

      {/* Main Content */}
      <main className="pb-28 lg:pb-8 min-h-screen bg-muted lg:max-w-6xl lg:mx-auto">
        {/* Main Action Card Section - White background */}
        <div className="bg-card px-4 py-6 lg:px-8 lg:py-10">
          {/* Mobile: centered, Desktop: two columns */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 max-w-5xl mx-auto">
            {/* Image - hidden on desktop */}
            <div className="lg:hidden flex flex-col items-center text-center mb-6">
              <Image
                src="/megaphone-woman.png"
                alt="Registre sua manifestação"
                width={120}
                height={120}
                className="mb-4"
              />

              {/* Title - mobile only */}
              <h1 className="text-lg font-semibold text-foreground mb-2">
                Registre sua manifestação
              </h1>

              {/* Description - mobile only */}
              <p className="text-sm text-muted-foreground mb-6">
                Faça denúncias, elogios, sugestões
                <br />
                ou reclamações de forma simples e<br />
                rápida
              </p>
            </div>

            {/* Desktop: Title and description */}
            <div className="hidden lg:block flex-1">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <RiMegaphoneLine className="size-6 text-secondary" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-foreground mb-2">
                    Registre sua manifestação
                  </h1>
                  <p className="text-muted-foreground">
                    Faça denúncias, elogios, sugestões ou reclamações de forma
                    simples e rápida. Sua voz é importante para transformar o
                    DF.
                  </p>
                </div>
              </div>

              {/* Action Buttons - Desktop */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/manifestacao"
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-hover text-secondary-foreground font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                >
                  <RiAddLine className="size-5" />
                  Nova Manifestação
                </Link>

                <Link
                  href="/historico"
                  className="inline-flex items-center gap-2 text-secondary hover:text-secondary-hover font-medium py-3 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 rounded"
                >
                  <RiSearchLine className="size-5" />
                  Consultar protocolo
                </Link>
              </div>
            </div>

            {/* Mobile Buttons */}
            <div className="lg:hidden w-full space-y-3">
              <Link
                href="/manifestacao"
                className="block w-full bg-secondary hover:bg-secondary-hover text-secondary-foreground font-medium py-3 px-6 rounded-md transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  <RiAddLine className="size-5" />
                  Nova Manifestação
                </span>
              </Link>

              <Link
                href="/historico"
                className="w-full text-secondary hover:text-secondary-hover font-medium py-2 px-4 text-sm flex items-center justify-center gap-2"
              >
                <RiSearchLine className="size-4" />
                Consultar protocolo
              </Link>
            </div>
          </div>
        </div>

        {/* Gray spacer */}
        <div className="h-3 bg-muted lg:hidden" />

        {/* Services List Section - Mobile only, Desktop has sidebar */}
        <div className="lg:hidden bg-card px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-foreground">Serviços</h3>
            <Link
              href="/servicos"
              className="text-xs text-secondary font-medium"
            >
              Ver tudo
            </Link>
          </div>

          <div className="border border-border rounded-lg divide-y divide-border">
            {/* O que é a Ouvidoria */}
            <Link
              href="/o-que-e-ouvidoria"
              className="flex items-center gap-3 p-3.5 hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-inset"
            >
              <RiMegaphoneLine className="size-5 text-secondary flex-shrink-0" />
              <span className="flex-1 text-sm font-medium text-foreground">
                Sobre a Ouvidoria
              </span>
              <RiArrowRightSLine className="size-5 text-muted-foreground flex-shrink-0" />
            </Link>

            {/* Orientações */}
            <Link
              href="/orientacoes"
              className="flex items-center gap-3 p-3.5 hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-inset"
            >
              <RiLightbulbLine className="size-5 text-secondary flex-shrink-0" />
              <span className="flex-1 text-sm font-medium text-foreground">
                Orientações para o registro
              </span>
              <RiArrowRightSLine className="size-5 text-muted-foreground flex-shrink-0" />
            </Link>

            {/* Perguntas frequentes */}
            <Link
              href="/ajuda"
              className="flex items-center gap-3 p-3.5 hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-inset"
            >
              <RiQuestionLine className="size-5 text-secondary flex-shrink-0" />
              <span className="flex-1 text-sm font-medium text-foreground">
                Perguntas frequentes
              </span>
              <RiArrowRightSLine className="size-5 text-muted-foreground flex-shrink-0" />
            </Link>

            {/* Canais de atendimento */}
            <Link
              href="/canais"
              className="flex items-center gap-3 p-3.5 hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-inset"
            >
              <RiCustomerService2Line className="size-5 text-secondary flex-shrink-0" />
              <span className="flex-1 text-sm font-medium text-foreground">
                Canais de atendimento
              </span>
              <RiArrowRightSLine className="size-5 text-muted-foreground flex-shrink-0" />
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Navigation - Mobile only */}
      <div className="lg:hidden">
        <MobileBottomNav activeTab="home" isAuthenticated={isAuthenticated} />
      </div>
    </>
  )
}

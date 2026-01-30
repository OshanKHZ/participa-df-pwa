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
  RiDashboardLine,
  RiExternalLinkLine,
} from 'react-icons/ri'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'
import { MenuDrawer } from '@/shared/components/MenuDrawer'
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { LinkButton } from '@/shared/components/Button'
import { BlogCarousel } from './BlogCarousel'
import type { BlogPost } from './BlogCarousel'

interface HomePageProps {
  isAuthenticated?: boolean
  userName?: string
}

export function HomePage({ isAuthenticated, userName }: HomePageProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Mock blog posts data - replace with real data from API
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Acessibilidade digital',
      image:
        '/imagens-blog/Participa-DF-e-Portal-da-Transparencia-passam-a-ser-100-acessiveis-digitalmente-620x420.webp',
      publishedAt: new Date(Date.now() - 1000 * 60 * 30),
      slug: 'acessibilidade-digital',
    },
    {
      id: '2',
      title: 'Ouvidoria do DF',
      image: '/imagens-blog/ouvidoria-620x620.webp',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      slug: 'conheca-ouvidoria',
    },
    {
      id: '3',
      title: 'Sua voz transforma',
      image: '/imagens-blog/09.PartcipaDF.webp',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      slug: 'sua-voz-transforma',
    },
    {
      id: '4',
      title: 'Canais de atendimento',
      image:
        '/imagens-blog/Participa-DF-e-Portal-da-Transparencia-passam-a-ser-100-acessiveis-digitalmente-620x420.webp',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      slug: 'canais-atendimento',
    },
    {
      id: '5',
      title: 'Novidades do Participa',
      image: '/imagens-blog/ouvidoria-620x620.webp',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
      slug: 'novidades-participa',
    },
  ]

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
      <main
        id="main-content"
        className="pb-28 lg:pb-8 min-h-screen bg-muted"
      >
        {/* Desktop Layout: Clean Version */}
        <div className="hidden lg:flex flex-col items-center pt-12 px-8">
          <div className="max-w-5xl w-full flex items-center justify-center gap-16">
            <div className="flex-shrink-0">
              <Image
                src="/Logo-OUV.svg"
                alt="Participa DF - Ouvidoria e e-Sic"
                width={280}
                height={100}
                priority
                className="h-auto w-[280px]"
              />
            </div>
            
            <div className="max-w-xl text-left space-y-4 text-lg text-foreground/80 font-light leading-relaxed">
              <p>
                Que bom que você acessou a plataforma de participação social do Governo do Distrito Federal.
                Os sistemas e-Sic (Acesso à Informação) e Ouv-DF (Ouvidorias do GDF) passam a compor o Participa DF.
              </p>
              <p className="text-primary font-medium">
                Todos os serviços de Ouvidoria e de Acesso à Informação em um só lugar e com login único.
              </p>
            </div>
          </div>

          {/* Grid of Cards */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-4xl w-full">
            {/* Nova Manifestação */}
            <Link 
              href="/manifestacao" 
              className="group flex flex-col p-5 bg-card border border-border/50 rounded-xl hover:border-secondary/50 hover:bg-accent/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ring-offset-background h-full"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <RiAddLine className="size-5 text-secondary" aria-hidden="true" />
                <h3 className="text-base font-semibold text-foreground font-outfit">Nova Manifestação</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-normal mb-5 flex-1">
                Registre denúncias, elogios, sugestões ou reclamações de forma simples.
              </p>
              <span className="w-full py-2 px-4 bg-success text-white text-xs font-medium rounded text-center hover:opacity-90 transition-opacity">
                Acessar
              </span>
            </Link>

            {/* Consultar Protocolo */}
            <Link 
              href="/consultar-manifestacoes" 
              className="group flex flex-col p-5 bg-card border border-border/50 rounded-xl hover:border-secondary/50 hover:bg-accent/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ring-offset-background h-full"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <RiSearchLine className="size-5 text-secondary" aria-hidden="true" />
                <h3 className="text-base font-semibold text-foreground font-outfit">Consultar Protocolo</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-normal mb-5 flex-1">
                Acompanhe o andamento da sua manifestação ou pedido de acesso.
              </p>
              <span className="w-full py-2 px-4 bg-warning text-white text-xs font-medium rounded text-center hover:opacity-90 transition-opacity">
                Acessar
              </span>
            </Link>

            {/* Painel de Ouvidoria */}
            <a 
              href="http://www.painel.ouv.df.gov.br/dashboard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col p-5 bg-card border border-border/50 rounded-xl hover:border-secondary/50 hover:bg-accent/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ring-offset-background h-full"
              aria-label="Painel da Ouvidoria (abre em nova aba)"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <RiDashboardLine className="size-5 text-secondary" aria-hidden="true" />
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground font-outfit">Painel Ouvidoria</h3>
                  <RiExternalLinkLine className="size-3.5 text-muted-foreground group-hover:text-secondary transition-colors" aria-hidden="true" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-normal mb-5 flex-1">
                Acesse indicadores, estatísticas e dados das ouvidorias do GDF.
              </p>
              <span className="w-full py-2 px-4 bg-secondary text-white text-xs font-medium rounded text-center hover:opacity-90 transition-opacity">
                Acessar
              </span>
            </a>
          </div>

          {/* Desktop Blog Carousel */}
          <div className="mt-12 w-full max-w-4xl">
             <BlogCarousel posts={blogPosts} className="hidden lg:block bg-transparent p-0" />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Main Action Card Section - White background */}
          <div className="bg-card px-4 py-6">
            {/* Mobile: centered */}
            <div className="flex flex-col">
            {/* Image */}
            <div className="flex flex-col items-center text-center mb-6">
              <Image
                src="/megaphone-woman.png"
                alt="Registre sua manifestação"
                width={120}
                height={120}
                className="mb-4"
                priority
                fetchPriority="high"
              />

              {/* Title */}
              <h1 className="text-lg font-semibold text-foreground mb-2">
                Registre sua manifestação
              </h1>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-6">
                Faça denúncias, elogios, sugestões
                <br />
                ou reclamações de forma simples e<br />
                rápida
              </p>
            </div>

            {/* Mobile Buttons */}
            <div className="w-full space-y-3">
              <LinkButton
                href="/manifestacao"
                variant="secondary"
                className="w-full rounded-md py-3"
              >
                <RiAddLine className="size-5" />
                Nova Manifestação
              </LinkButton>

              <LinkButton
                href="/consultar-manifestacoes"
                variant="accent"
                size="sm"
                className="w-full"
              >
                <RiSearchLine className="size-4" />
                Consultar protocolo
              </LinkButton>
            </div>
          </div>
          </div>

          {/* Gray spacer */}
          <div className="h-3 bg-muted" />

          {/* Blog Carousel - Mobile only */}
          <BlogCarousel posts={blogPosts} />

          {/* Gray spacer */}
          <div className="h-3 bg-muted" />

          {/* Services List Section - Mobile only */}
          <section className="bg-card px-4 py-4" aria-label="Serviços">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Serviços</h2>
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
              className="flex items-center gap-3 p-3.5 hover:bg-accent transition-colors btn-focus focus:ring-inset"
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
              className="flex items-center gap-3 p-3.5 hover:bg-accent transition-colors btn-focus focus:ring-inset"
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
              className="flex items-center gap-3 p-3.5 hover:bg-accent transition-colors btn-focus focus:ring-inset"
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
              className="flex items-center gap-3 p-3.5 hover:bg-accent transition-colors btn-focus focus:ring-inset"
            >
              <RiCustomerService2Line className="size-5 text-secondary flex-shrink-0" />
              <span className="flex-1 text-sm font-medium text-foreground">
                Canais de atendimento
              </span>
              <RiArrowRightSLine className="size-5 text-muted-foreground flex-shrink-0" />
            </Link>
          </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation - Mobile only */}
      <div className="lg:hidden">
        <MobileBottomNav activeTab="home" isAuthenticated={isAuthenticated} />
      </div>
    </>
  )
}

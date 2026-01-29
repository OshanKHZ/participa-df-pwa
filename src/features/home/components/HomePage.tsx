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
import { LinkButton } from '@/shared/components/Button'
import { BlogCarousel } from './BlogCarousel'
import type { BlogPost } from './BlogCarousel'

interface HomePageProps {
  isAuthenticated?: boolean
  userName?: string
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'agora'
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h`
  }
  const days = Math.floor(diffInSeconds / 86400)
  return `${days}d`
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
        {/* Desktop Layout: Sidebar + Blog Banner */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="grid grid-cols-[400px_1fr] gap-8">
              {/* Left Sidebar - Menu */}
              <aside className="bg-primary-light shadow-lg overflow-hidden h-fit sticky top-6">
                {/* Search Bar */}
                <div className="px-4 pt-4 pb-3">
                  <div className="relative">
                    <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/50 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Buscar serviços..."
                      className="w-full pl-9 pr-3 py-2 bg-white/10 border-0 focus:bg-white/20 rounded text-white placeholder:text-white/50 text-sm transition-colors"
                      aria-label="Buscar serviços"
                    />
                  </div>
                </div>

                {/* Menu Items */}
                <div className="divide-y divide-white/10">
                  {/* Nova Manifestação */}
                  <Link
                    href="/manifestacao"
                    className="block px-5 py-3 hover:bg-white/10 transition-colors"
                  >
                    <h4 className="text-sm font-medium text-white">Nova Manifestação</h4>
                  </Link>

                  {/* Consultar Protocolo */}
                  <Link
                    href="/historico"
                    className="block px-5 py-3 hover:bg-white/10 transition-colors"
                  >
                    <h4 className="text-sm font-medium text-white">Consultar protocolo</h4>
                  </Link>

                  {/* Sobre a Ouvidoria */}
                  <Link
                    href="/o-que-e-ouvidoria"
                    className="block px-5 py-3 hover:bg-white/10 transition-colors"
                  >
                    <h4 className="text-sm font-medium text-white">Sobre a Ouvidoria</h4>
                  </Link>

                  {/* Orientações */}
                  <Link
                    href="/orientacoes"
                    className="block px-5 py-3 hover:bg-white/10 transition-colors"
                  >
                    <h4 className="text-sm font-medium text-white">Orientações para o registro</h4>
                  </Link>

                  {/* Perguntas Frequentes */}
                  <Link
                    href="/ajuda"
                    className="block px-5 py-3 hover:bg-white/10 transition-colors"
                  >
                    <h4 className="text-sm font-medium text-white">Perguntas frequentes</h4>
                  </Link>

                  {/* Canais de Atendimento */}
                  <Link
                    href="/canais"
                    className="block px-5 py-3 hover:bg-white/10 transition-colors"
                  >
                    <h4 className="text-sm font-medium text-white">Canais de atendimento</h4>
                  </Link>
                </div>
              </aside>

              {/* Right Content - Blog Banner */}
              <div className="bg-card rounded-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">Blog</h2>
                  <Link
                    href="/blog"
                    className="text-sm text-secondary hover:text-secondary-hover font-medium"
                  >
                    Ver todos
                  </Link>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {blogPosts.slice(0, 4).map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group btn-focus rounded-lg"
                    >
                      <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted mb-3">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 1280px) 300px, 400px"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {formatTimeAgo(post.publishedAt)}
                      </p>
                      <h3 className="text-base font-medium text-foreground line-clamp-2 leading-snug group-hover:text-secondary transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
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
                href="/historico"
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

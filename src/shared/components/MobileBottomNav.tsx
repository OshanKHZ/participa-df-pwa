'use client'

import Link from 'next/link'
import { PiPersonArmsSpreadFill } from 'react-icons/pi'
import {
  RiHomeLine,
  RiAppsLine,
  RiAddLine,
  RiQuestionLine,
  RiUserLine,
  RiLoginBoxLine,
} from 'react-icons/ri'

interface MobileBottomNavProps {
  activeTab?: 'home' | 'services' | 'help' | 'profile' | 'acessar'
  isAuthenticated?: boolean
}

export function MobileBottomNav({
  activeTab,
  isAuthenticated = false,
}: MobileBottomNavProps) {
  return (
    <>
      {/* Floating accessibility button */}
      <button
        className="fixed bottom-20 right-4 z-fab flex items-center justify-center w-14 h-14 bg-secondary text-secondary-foreground rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
        aria-label="Acessibilidade"
      >
        <PiPersonArmsSpreadFill className="size-7" />
      </button>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-fab">
        <div className="flex items-center justify-around py-2">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-lg transition-colors ${
              activeTab === 'home'
                ? 'text-secondary bg-secondary/10'
                : 'text-muted-foreground'
            }`}
          >
            <RiHomeLine className="size-6" />
            <span className="text-xs font-medium">Início</span>
          </Link>

          <Link
            href="/servicos"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-lg transition-colors ${
              activeTab === 'services'
                ? 'text-secondary bg-secondary/10'
                : 'text-muted-foreground'
            }`}
          >
            <RiAppsLine className="size-6" />
            <span className="text-xs font-medium">Serviços</span>
          </Link>

          <Link
            href="/manifestacao"
            className="flex items-center justify-center w-14 h-14 -mt-6 bg-secondary hover:bg-secondary-hover rounded-xl shadow-lg transition-colors"
            aria-label="Nova manifestação"
          >
            <RiAddLine className="size-7 text-white" strokeWidth={0.5} />
          </Link>

          <Link
            href="/ajuda"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-lg transition-colors ${
              activeTab === 'help'
                ? 'text-secondary bg-secondary/10'
                : 'text-muted-foreground'
            }`}
          >
            <RiQuestionLine className="size-6" />
            <span className="text-xs font-medium">Ajuda</span>
          </Link>

          <Link
            href={isAuthenticated ? '/perfil' : '/entrar'}
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-lg transition-colors ${
              activeTab === 'profile' || activeTab === 'acessar'
                ? 'text-secondary bg-secondary/10'
                : 'text-muted-foreground'
            }`}
          >
            {isAuthenticated ? (
              <>
                <RiUserLine className="size-6" />
                <span className="text-xs font-medium">Perfil</span>
              </>
            ) : (
              <>
                <RiLoginBoxLine className="size-6" />
                <span className="text-xs font-medium">Acessar</span>
              </>
            )}
          </Link>
        </div>
      </nav>
    </>
  )
}

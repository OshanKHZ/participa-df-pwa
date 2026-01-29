'use client'

import { useState } from 'react'
import Image from 'next/image'
import { RiMenuLine } from 'react-icons/ri'
import { MenuDrawer } from './MenuDrawer'

interface HomeMobileHeaderProps {
  isAuthenticated?: boolean
  userName?: string
  slogan?: string
}

export function HomeMobileHeader({
  isAuthenticated = false,
  userName,
  slogan = 'Você no controle!',
}: HomeMobileHeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      <MenuDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        isAuthenticated={isAuthenticated}
        userName={userName}
      />
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
          <p className="text-center text-sm font-medium text-white">{slogan}</p>
        </div>
      </header>
    </>
  )
}

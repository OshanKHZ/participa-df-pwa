'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RiArrowLeftLine, RiMenuLine } from 'react-icons/ri'
import { MenuDrawer } from './MenuDrawer'

interface MobileHeaderProps {
  title: string
  isAuthenticated?: boolean
  userName?: string
}

export function MobileHeader({ title, isAuthenticated = false, userName }: MobileHeaderProps) {
  const router = useRouter()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      <MenuDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        isAuthenticated={isAuthenticated}
        userName={userName}
      />
      <header className="bg-primary text-white sticky top-0 z-header">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="size-9 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Voltar"
            >
              <RiArrowLeftLine className="size-6" />
            </button>
            <h1 className="text-lg font-semibold flex-1">{title}</h1>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="size-9 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Menu"
            >
              <RiMenuLine className="size-6" />
            </button>
          </div>
        </div>
      </header>
    </>
  )
}

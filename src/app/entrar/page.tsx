'use client'

import { useRouter } from 'next/navigation'
import { RiArrowLeftLine } from 'react-icons/ri'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'
import { AuthForm } from '@/shared/components/AuthForm'
import { DesktopHeader } from '@/shared/components/DesktopHeader'

export default function EntrarPage() {
  const router = useRouter()

  return (
    <>
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Header */}
      <header className="lg:hidden bg-primary text-white sticky top-0 z-header">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="size-9 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Voltar"
            >
              <RiArrowLeftLine className="size-6" />
            </button>
            <h1 className="text-lg font-semibold">Entrar</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-background">
        <div className="max-w-md mx-auto px-4 py-6 lg:px-8 lg:py-16 pb-20 lg:pb-16">
          <AuthForm mode="login" />
        </div>
      </main>

      {/* Bottom Navigation - Mobile only */}
      <div className="lg:hidden">
        <MobileBottomNav activeTab="home" />
      </div>
    </>
  )
}

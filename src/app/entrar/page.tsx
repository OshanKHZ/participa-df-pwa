'use client'

import { MobileHeader } from '@/shared/components/MobileHeader'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'
import { AuthForm } from '../../shared/components/AuthForm'
import { DesktopHeader } from '@/shared/components/DesktopHeader'

export default function EntrarPage() {
  return (
    <>
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Header */}
      <MobileHeader title="Entrar" />

      {/* Main Content */}
      <main className="min-h-screen bg-background">
        <div className="max-w-md mx-auto px-4 py-6 lg:px-8 lg:py-16 pb-20 lg:pb-16">
          <AuthForm mode="login" />
        </div>
      </main>

      {/* Bottom Navigation - Mobile only */}
      <div className="lg:hidden">
        <MobileBottomNav activeTab="login" />
      </div>
    </>
  )
}

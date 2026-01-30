'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MobileHeader } from '@/shared/components/MobileHeader'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'
import { AuthForm } from '@/features/auth/components/AuthForm'
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { getSessionData } from '@/app/actions/auth'

export default function AcessarPage() {
  const router = useRouter()

  useEffect(() => {
    getSessionData().then(user => {
      if (user) {
        router.replace('/')
      }
    })
  }, [router])
  return (
    <>
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Header */}
      <MobileHeader title="Acessar" />

      {/* Main Content */}
      <main className="min-h-screen bg-background">
        <div className="max-w-md mx-auto px-4 py-6 lg:px-8 lg:py-16 pb-20 lg:pb-16">
          <AuthForm mode="login" />
        </div>
      </main>

      {/* Bottom Navigation - Mobile only */}
      <div className="lg:hidden">
        <MobileBottomNav activeTab="acessar" />
      </div>
    </>
  )
}

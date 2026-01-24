'use client'

import { useRouter } from 'next/navigation'
import { RiArrowLeftLine } from 'react-icons/ri'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'
import { AuthForm } from '@/shared/components/AuthForm'

export default function CadastrarPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
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
            <h1 className="text-lg font-semibold">Cadastrar-se</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        <AuthForm mode="register" />
      </main>

      {/* Bottom Navigation */}
      <MobileBottomNav activeTab="home" />
    </div>
  )
}

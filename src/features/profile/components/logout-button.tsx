'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RiLogoutBoxRLine } from 'react-icons/ri'
import { logout } from '@/app/actions/auth'
import { toastHelper } from '@/shared/utils/toastHelper'

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await logout()
      toastHelper.success('Você saiu da conta', 'Até logo! 👋')
      
      // Delay to let toast appear
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      router.push('/entrar')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      toastHelper.error('Erro ao sair da conta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium py-3 px-4 rounded-xl transition-all shadow-sm"
    >
      {isLoading ? (
        <div className="size-5 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
      ) : (
        <RiLogoutBoxRLine className="size-5" />
      )}
      <span>{isLoading ? 'Saindo...' : 'Sair da conta'}</span>
    </button>
  )
}

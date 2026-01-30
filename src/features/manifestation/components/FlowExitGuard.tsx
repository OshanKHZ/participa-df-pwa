'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ExitConfirmModal } from '@/shared/components/ExitConfirmModal'
import {
  getCurrentDraft,
  saveDraft,
  clearCurrentDraft,
} from '@/shared/utils/draftManager'

export function FlowExitGuard() {
  const router = useRouter()
  const pathname = usePathname()
  const [showExitModal, setShowExitModal] = useState(false)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)

  // Ignorar o guard se já estiver na página de protocolo (sucesso)
  // ou se não for uma página de fluxo (ex: layout wrapper)
  const isInFlow = pathname?.startsWith('/manifestacao') && 
                  !pathname?.includes('/protocolo')

  const handleInteract = useCallback((e: MouseEvent) => {
    if (!isInFlow) return

    // Buscar o elemento âncora mais próximo (caso o clique seja em um filho do link)
    const target = (e.target as HTMLElement).closest('a')
    
    if (!target) return

    const href = target.getAttribute('href')
    if (!href) return

    // Se for link externo, ancora, ou javascript:void, ignora
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript')) return

    // Se o link for para dentro do fluxo de manifestação, permite
    // Exceção: Se for para /manifestacao (home do fluxo) vindo de um passo interno, talvez queira confirmar?
    // Por enquanto vamos assumir que navegar DENTRO de /manifestacao/* é seguro/permitido
    if (href.startsWith('/manifestacao') && !href.includes('/protocolo')) return

    // Tem dados não salvos?
    // Verificação simples: se tem tipo, assunto ou conteúdo
    const currentDraft = getCurrentDraft()
    const hasData =
      currentDraft.type || currentDraft.subject || currentDraft.content?.text

    if (!hasData) return

    // Previne a navegação
    e.preventDefault()
    e.stopPropagation()
    
    // Mostra modal e guarda a URL
    setPendingUrl(href)
    setShowExitModal(true)
  }, [isInFlow])

  useEffect(() => {
    document.addEventListener('click', handleInteract, true) // Capture phase to ensure we catch it first
    return () => {
      document.removeEventListener('click', handleInteract, true)
    }
  }, [handleInteract])

  const handleSaveAndExit = async () => {
    const currentDraft = getCurrentDraft()
    await saveDraft(currentDraft)
    setShowExitModal(false)
    if (pendingUrl) {
      router.push(pendingUrl)
      setPendingUrl(null)
    }
  }

  const handleExitWithoutSaving = () => {
    clearCurrentDraft()
    setShowExitModal(false)
    if (pendingUrl) {
      router.push(pendingUrl)
      setPendingUrl(null)
    }
  }

  const handleClose = () => {
    setShowExitModal(false)
    setPendingUrl(null)
  }

  return (
    <ExitConfirmModal
      isOpen={showExitModal}
      onClose={handleClose}
      onSaveAndExit={handleSaveAndExit}
      onExitWithoutSaving={handleExitWithoutSaving}
    />
  )
}

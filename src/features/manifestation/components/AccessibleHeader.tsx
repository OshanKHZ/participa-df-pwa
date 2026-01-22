'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  RiQuestionLine,
  RiVolumeUpLine,
  RiFontSize,
  RiLogoutBoxLine,
} from 'react-icons/ri'
import { useTextToSpeech } from '@/shared/hooks/useTextToSpeech'
import { useFontSize } from '@/shared/contexts/FontSizeContext'
import { ExitConfirmModal } from '@/shared/components/ExitConfirmModal'
import {
  getCurrentDraft,
  saveDraft,
  clearCurrentDraft,
} from '@/shared/utils/draftManager'
import { DURATION, FONT_LEVELS } from '@/shared/constants/designTokens'

interface AccessibleHeaderProps {
  currentStep: number
  totalSteps: number
  completedSteps?: number
}

export function AccessibleHeader({
  currentStep,
  totalSteps,
  completedSteps = 0,
}: AccessibleHeaderProps) {
  const router = useRouter()
  const { setEnabled, isEnabled } = useTextToSpeech()
  const { fontSizeLevel, setFontSizeLevel } = useFontSize()
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [showFontLevel, setShowFontLevel] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)

  const handleFontSize = () => {
    const newLevel = (fontSizeLevel + 1) % FONT_LEVELS.COUNT
    setFontSizeLevel(newLevel)

    // Show level indicator
    setShowFontLevel(true)
    setTimeout(() => setShowFontLevel(false), DURATION.FONT_LEVEL_DISPLAY)
  }

  const handleExit = () => {
    const currentDraft = getCurrentDraft()
    const hasData =
      currentDraft.type || currentDraft.subject || currentDraft.content?.text

    if (hasData) {
      setShowExitModal(true)
    } else {
      router.push('/')
    }
  }

  const handleSaveAndExit = () => {
    const currentDraft = getCurrentDraft()
    saveDraft(currentDraft)
    setShowExitModal(false)
    router.push('/')
  }

  const handleExitWithoutSaving = () => {
    clearCurrentDraft()
    setShowExitModal(false)
    router.push('/')
  }

  const handleAudioToggle = () => {
    const newState = !audioEnabled
    setAudioEnabled(newState)
    setEnabled(newState)
  }

  // Sync state on mount
  useEffect(() => {
    setAudioEnabled(isEnabled())
  }, [isEnabled])

  return (
    <header className="bg-primary">
      {/* Top section - Dark blue */}
      <div className="px-4 py-4">
        {/* Top row - Icons */}
        <div className="flex items-center justify-between">
          {/* Left - Exit */}
          <button
            onClick={handleExit}
            className="w-11 h-11 rounded border-2 border-destructive bg-destructive text-white flex items-center justify-center hover:bg-destructive/90 transition-colors"
            aria-label="Sair"
          >
            <RiLogoutBoxLine className="size-5" />
          </button>

          {/* Right - Help + Accessibility controls */}
          <div className="flex items-center gap-2">
            <button
              className="w-10 h-10 rounded flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Ajuda"
            >
              <RiQuestionLine className="size-5" />
            </button>

            <button
              onClick={handleAudioToggle}
              className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${
                audioEnabled
                  ? 'bg-white text-primary'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              aria-label={audioEnabled ? 'Desativar áudio' : 'Ativar áudio'}
            >
              <RiVolumeUpLine className="size-5" />
            </button>

            <button
              onClick={handleFontSize}
              className={`w-10 h-10 rounded flex items-center justify-center transition-colors relative ${
                fontSizeLevel > FONT_LEVELS.MIN
                  ? 'bg-white text-primary'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              aria-label={`Tamanho da fonte: nível ${fontSizeLevel + 1}`}
            >
              <RiFontSize className="size-5" />
              {showFontLevel && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white text-primary text-xs font-semibold px-2 py-1 rounded shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                  {fontSizeLevel + 1}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom section - Lighter blue */}
      <div className="bg-primary-light px-4 py-3">
        {/* Progress info */}
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-white/80">
            Passo {currentStep} de {totalSteps}
          </span>
          <span className="text-white/80">
            {completedSteps}/{totalSteps} respondidas
          </span>
        </div>

        {/* Progress pills */}
        <div
          className="flex gap-1.5"
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Progresso: ${currentStep} de ${totalSteps}`}
        >
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => {
            // Current step = yellow, completed = green, future = white
            let bgColor = 'bg-white/30' // Future steps
            if (step < currentStep) {
              bgColor = 'bg-progress' // Completed (green)
            } else if (step === currentStep) {
              bgColor = 'bg-yellow-400' // Current (yellow)
            }

            return (
              <div
                key={step}
                className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${bgColor}`}
              />
            )
          })}
        </div>
      </div>

      <ExitConfirmModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onSaveAndExit={handleSaveAndExit}
        onExitWithoutSaving={handleExitWithoutSaving}
      />
    </header>
  )
}

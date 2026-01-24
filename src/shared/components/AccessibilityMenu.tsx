'use client'

import { useState, useEffect } from 'react'
import { PiPersonArmsSpreadFill } from 'react-icons/pi'
import {
  RiText,
  RiAddLine,
  RiSubtractLine,
  RiVolumeUpLine,
  RiVolumeMuteLine,
  RiContrastDrop2Line,
  RiContrastLine,
  RiCloseLine,
} from 'react-icons/ri'
import { useFontSize } from '@/shared/contexts/FontSizeContext'
import { useTextToSpeech } from '@/shared/hooks/useTextToSpeech'
import { TOGGLE, FONT_LEVELS } from '@/shared/constants/designTokens'

export function AccessibilityMenu() {
  const { fontSizeLevel, setFontSizeLevel } = useFontSize()
  const { setEnabled, isEnabled } = useTextToSpeech()
  const [isOpen, setIsOpen] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [highContrast, setHighContrast] = useState(false)

  // Initialize audio state on mount
  useEffect(() => {
    setAudioEnabled(isEnabled())
  }, [isEnabled])

  const toggleAudio = () => {
    const newState = !audioEnabled
    setAudioEnabled(newState)
    setEnabled(newState)
  }

  const toggleHighContrast = () => {
    setHighContrast(!highContrast)
    if (!highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }

  const handleIncreaseFont = () => {
    if (fontSizeLevel < FONT_LEVELS.MAX) {
      setFontSizeLevel(fontSizeLevel + 1)
    }
  }

  const handleDecreaseFont = () => {
    if (fontSizeLevel > FONT_LEVELS.MIN) {
      setFontSizeLevel(fontSizeLevel - 1)
    }
  }

  const resetAll = () => {
    setFontSizeLevel(FONT_LEVELS.MIN)
    setAudioEnabled(true)
    setEnabled(true)
    setHighContrast(false)
    document.documentElement.classList.remove('high-contrast')
  }

  return (
    <div className="hidden lg:block">
      {/* Floating Toggle Button - Desktop only */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-fab w-14 h-14 bg-secondary hover:bg-secondary-hover text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          aria-label="Acessibilidade"
          title="Acessibilidade"
        >
          <PiPersonArmsSpreadFill className="w-6 h-6" />
        </button>
      )}

      {/* Panel - Desktop only */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-dropdown"
            onClick={() => setIsOpen(false)}
          />

          {/* Accessibility Panel */}
          <div className="fixed bottom-8 right-8 z-dropdown w-80 bg-white rounded-2xl shadow-2xl border border-border">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <PiPersonArmsSpreadFill className="w-5 h-5 text-secondary" />
                <h3 className="font-semibold text-foreground">
                  Acessibilidade
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Fechar"
              >
                <RiCloseLine className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Font Size */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <RiText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Tamanho do texto
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDecreaseFont}
                    disabled={fontSizeLevel <= FONT_LEVELS.MIN}
                    className="flex-1 py-2 px-3 bg-muted hover:bg-muted-foreground/20 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
                    aria-label="Diminuir texto"
                  >
                    <RiSubtractLine className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-muted-foreground min-w-[3rem] text-center">
                    {fontSizeLevel + 1}
                  </span>
                  <button
                    onClick={handleIncreaseFont}
                    disabled={fontSizeLevel >= FONT_LEVELS.MAX}
                    className="flex-1 py-2 px-3 bg-muted hover:bg-muted-foreground/20 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
                    aria-label="Aumentar texto"
                  >
                    <RiAddLine className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Audio Toggle */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  {audioEnabled ? (
                    <RiVolumeUpLine className="w-4 h-4 text-secondary" />
                  ) : (
                    <RiVolumeMuteLine className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    Leitura em voz alta
                  </span>
                </div>
                <button
                  onClick={toggleAudio}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    audioEnabled ? 'bg-secondary' : 'bg-muted'
                  }`}
                  aria-label={audioEnabled ? 'Desativar áudio' : 'Ativar áudio'}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      audioEnabled
                        ? TOGGLE.TRANSITION_ON
                        : TOGGLE.TRANSITION_OFF
                    }`}
                  />
                </button>
              </div>

              {/* High Contrast Toggle */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  {highContrast ? (
                    <RiContrastLine className="w-4 h-4 text-secondary" />
                  ) : (
                    <RiContrastDrop2Line className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    Alto contraste
                  </span>
                </div>
                <button
                  onClick={toggleHighContrast}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    highContrast ? 'bg-secondary' : 'bg-muted'
                  }`}
                  aria-label={
                    highContrast
                      ? 'Desativar alto contraste'
                      : 'Ativar alto contraste'
                  }
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      highContrast
                        ? TOGGLE.TRANSITION_ON
                        : TOGGLE.TRANSITION_OFF
                    }`}
                  />
                </button>
              </div>

              {/* Reset */}
              <button
                onClick={resetAll}
                className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Restaurar padrões
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

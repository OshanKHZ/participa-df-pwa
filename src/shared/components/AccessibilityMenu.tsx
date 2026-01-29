'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
      {/* Fixed Accessibility Buttons - Right side */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-fab flex flex-col gap-3">
        {/* High Contrast Button - Acessibilidades Adicionais */}
        <button
          type="button"
          onClick={toggleHighContrast}
          className="w-10 h-10 shadow-lg transition-all hover:scale-105 btn-focus rounded-lg flex items-center justify-center cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #3690FA 0%, #2266D2 100%)'
          }}
          aria-label="Acessibilidades Adicionais"
          title="Acessibilidades Adicionais"
        >
          <Image
            src="/accessibility/eye.png"
            alt=""
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>

        {/* Audio Button - Voz */}
        <button
          type="button"
          onClick={toggleAudio}
          className="w-10 h-10 shadow-lg transition-all hover:scale-105 btn-focus rounded-lg flex items-center justify-center cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #3690FA 0%, #2266D2 100%)'
          }}
          aria-label={audioEnabled ? 'Desativar voz' : 'Ativar voz'}
          title={audioEnabled ? 'Desativar voz' : 'Ativar voz'}
        >
          <Image
            src="/accessibility/voice.png"
            alt=""
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>

        {/* Libras Button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="shadow-lg transition-all hover:scale-105 btn-focus rounded-lg cursor-pointer"
          aria-label="Libras"
          title="Libras"
        >
          <Image
            src="/accessibility/access_icon.svg"
            alt=""
            width={40}
            height={40}
            className="w-10 h-10"
          />
        </button>
      </div>

      {/* Panel - Desktop only */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-dropdown"
            onClick={() => setIsOpen(false)}
          />

          {/* Accessibility Panel */}
          <div className="fixed right-20 top-1/2 -translate-y-1/2 z-dropdown w-80 bg-white rounded-2xl shadow-2xl border border-border">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Image
                  src="/accessibility/access_icon.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <h3 className="font-semibold text-foreground">
                  Acessibilidade
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors btn-focus"
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
                    type="button"
                    onClick={handleDecreaseFont}
                    disabled={fontSizeLevel <= FONT_LEVELS.MIN}
                    className="flex-1 py-2 px-3 bg-muted hover:bg-muted-foreground/20 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
                    aria-label="Diminuir texto"
                  >
                    <RiSubtractLine className="w-4 h-4" />
                  </button>
                  <span
                    className="text-sm font-medium text-muted-foreground min-w-[3rem] text-center"
                    aria-live="polite"
                  >
                    {fontSizeLevel + 1}
                  </span>
                  <button
                    type="button"
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
                  type="button"
                  onClick={toggleAudio}
                  role="switch"
                  aria-checked={audioEnabled}
                  className={`w-11 h-6 rounded-full transition-colors btn-focus ${
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
                  type="button"
                  onClick={toggleHighContrast}
                  role="switch"
                  aria-checked={highContrast}
                  className={`w-11 h-6 rounded-full transition-colors btn-focus ${
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
                type="button"
                onClick={resetAll}
                className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:underline"
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

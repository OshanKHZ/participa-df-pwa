'use client'

import { useState } from 'react'
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
  RiPaletteLine,
  RiDropLine,
} from 'react-icons/ri'
import { useAccessibility, type SaturationLevel } from '@/shared/contexts/AccessibilityContext'
import { useTextToSpeech } from '@/shared/hooks/useTextToSpeech'
import { TOGGLE, FONT_LEVELS } from '@/shared/constants/designTokens'

export function AccessibilityMenu() {
  const { preferences, setFontSize, toggleHighContrast, toggleMonochrome, setSaturation, resetAll } = useAccessibility()
  const { setEnabled, isEnabled } = useTextToSpeech()
  const [isOpen, setIsOpen] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)

  // Sync audio state on mount
  useState(() => {
    setAudioEnabled(isEnabled())
  })

  const toggleAudio = () => {
    const newState = !audioEnabled
    setAudioEnabled(newState)
    setEnabled(newState)
  }

  const handleIncreaseFont = () => {
    if (preferences.fontSize < FONT_LEVELS.MAX) {
      setFontSize(preferences.fontSize + 1)
    }
  }

  const handleDecreaseFont = () => {
    if (preferences.fontSize > FONT_LEVELS.MIN) {
      setFontSize(preferences.fontSize - 1)
    }
  }

  const handleResetAll = () => {
    resetAll()
    setAudioEnabled(true)
    setEnabled(true)
  }

  return (
    <div className="hidden lg:block">
      {/* Fixed Accessibility Buttons - Right side */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-fab flex flex-col gap-3">
        {/* Accessibility Menu Button (Eye icon) */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 shadow-lg transition-all hover:scale-105 btn-focus rounded-lg flex items-center justify-center cursor-pointer accessibility-panel-exempt"
          style={{
            background: isOpen
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #3690FA 0%, #2266D2 100%)'
          }}
          aria-label="Abrir menu de acessibilidade"
          title="Abrir menu de acessibilidade"
        >
          <Image
            src="/accessibility/eye.png"
            alt=""
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>

        {/* Audio Button */}
        <button
          type="button"
          onClick={toggleAudio}
          className="w-10 h-10 shadow-lg transition-all hover:scale-105 btn-focus rounded-lg flex items-center justify-center cursor-pointer accessibility-panel-exempt"
          style={{
            background: audioEnabled
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #3690FA 0%, #2266D2 100%)'
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
          className="shadow-lg transition-all hover:scale-105 btn-focus rounded-lg cursor-pointer accessibility-panel-exempt"
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
          <div className="accessibility-panel accessibility-panel-exempt fixed right-20 top-1/2 -translate-y-1/2 z-dropdown w-80 bg-white rounded-2xl shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="accessibility-panel-exempt flex items-center justify-between p-4 border-b border-border sticky top-0 bg-white z-10">
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
            <div className="accessibility-panel-exempt p-4 space-y-4">
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
                    disabled={preferences.fontSize <= FONT_LEVELS.MIN}
                    className="accessibility-panel-exempt flex-1 py-2 px-3 bg-muted hover:bg-muted-foreground/20 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
                    aria-label="Diminuir texto"
                  >
                    <RiSubtractLine className="w-4 h-4" />
                  </button>
                  <span
                    className="accessibility-panel-exempt text-sm font-medium text-muted-foreground min-w-[3rem] text-center"
                    aria-live="polite"
                  >
                    {preferences.fontSize + 1}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncreaseFont}
                    disabled={preferences.fontSize >= FONT_LEVELS.MAX}
                    className="accessibility-panel-exempt flex-1 py-2 px-3 bg-muted hover:bg-muted-foreground/20 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
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
                  className={`accessibility-panel-exempt w-11 h-6 rounded-full transition-colors btn-focus ${
                    audioEnabled ? 'bg-secondary' : 'bg-muted'
                  }`}
                  aria-label={audioEnabled ? 'Desativar áudio' : 'Ativar áudio'}
                >
                  <div
                    className={`accessibility-panel-exempt w-5 h-5 bg-white rounded-full shadow transition-transform ${
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
                  {preferences.highContrast ? (
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
                  aria-checked={preferences.highContrast}
                  className={`accessibility-panel-exempt w-11 h-6 rounded-full transition-colors btn-focus ${
                    preferences.highContrast ? 'bg-secondary' : 'bg-muted'
                  }`}
                  aria-label={
                    preferences.highContrast
                      ? 'Desativar alto contraste'
                      : 'Ativar alto contraste'
                  }
                >
                  <div
                    className={`accessibility-panel-exempt w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      preferences.highContrast
                        ? TOGGLE.TRANSITION_ON
                        : TOGGLE.TRANSITION_OFF
                    }`}
                  />
                </button>
              </div>

              {/* Monochrome Toggle */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <RiPaletteLine className={`w-4 h-4 ${preferences.monochrome ? 'text-secondary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium text-foreground">
                    Modo monocromático
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleMonochrome}
                  role="switch"
                  aria-checked={preferences.monochrome}
                  className={`accessibility-panel-exempt w-11 h-6 rounded-full transition-colors btn-focus ${
                    preferences.monochrome ? 'bg-secondary' : 'bg-muted'
                  }`}
                  aria-label={
                    preferences.monochrome
                      ? 'Desativar modo monocromático'
                      : 'Ativar modo monocromático'
                  }
                >
                  <div
                    className={`accessibility-panel-exempt w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      preferences.monochrome
                        ? TOGGLE.TRANSITION_ON
                        : TOGGLE.TRANSITION_OFF
                    }`}
                  />
                </button>
              </div>

              {/* Saturation Control */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <RiDropLine className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Saturação de cores
                  </span>
                </div>
                <div className="flex gap-2">
                  {(['low', 'normal', 'high'] as SaturationLevel[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSaturation(level)}
                      className={`accessibility-panel-exempt flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        preferences.saturation === level
                          ? 'bg-secondary text-white'
                          : 'bg-muted hover:bg-muted-foreground/20 text-foreground'
                      }`}
                      aria-label={`Saturação ${level === 'low' ? 'baixa' : level === 'normal' ? 'normal' : 'alta'}`}
                      aria-pressed={preferences.saturation === level}
                    >
                      {level === 'low' ? 'Baixa' : level === 'normal' ? 'Normal' : 'Alta'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <button
                type="button"
                onClick={handleResetAll}
                className="accessibility-panel-exempt w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:underline"
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

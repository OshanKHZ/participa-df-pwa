'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  RiAlarmWarningLine,
  RiChatSmile3Line,
  RiLightbulbLine,
  RiErrorWarningLine,
  RiQuestionLine,
  RiInformationLine,
  RiCheckLine,
  RiVolumeUpLine,
} from 'react-icons/ri'
import { AccessibleHeader } from '@/features/manifestation/components/AccessibleHeader'
import { NavigationFooter } from '@/features/manifestation/components/NavigationFooter'
import { ExitConfirmModal } from '@/shared/components/ExitConfirmModal'
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { useTextToSpeech } from '@/shared/hooks/useTextToSpeech'
import { AUDIO_TEXTS, getAudioText } from '@/shared/constants/audioTexts'
import { getStepProgress } from '@/shared/utils/stepProgress'
import { useStepNavigation } from '@/shared/hooks/useStepNavigation'
import { STEPS, COMPLETED_STEPS } from '@/shared/constants/designTokens'

const manifestationTypes = [
  {
    id: 'denuncia',
    ...AUDIO_TEXTS.manifestationType.denuncia,
    icon: RiAlarmWarningLine,
    color: 'bg-type-denuncia',
  },
  {
    id: 'reclamacao',
    ...AUDIO_TEXTS.manifestationType.reclamacao,
    icon: RiErrorWarningLine,
    color: 'bg-type-reclamacao',
  },
  {
    id: 'sugestao',
    ...AUDIO_TEXTS.manifestationType.sugestao,
    icon: RiLightbulbLine,
    color: 'bg-type-sugestao',
  },
  {
    id: 'elogio',
    ...AUDIO_TEXTS.manifestationType.elogio,
    icon: RiChatSmile3Line,
    color: 'bg-type-elogio',
  },
  {
    id: 'solicitacao',
    ...AUDIO_TEXTS.manifestationType.solicitacao,
    icon: RiQuestionLine,
    color: 'bg-type-solicitacao',
  },
  {
    id: 'informacao',
    ...AUDIO_TEXTS.manifestationType.informacao,
    icon: RiInformationLine,
    color: 'bg-type-informacao',
  },
]

export default function ManifestationTypePage() {
  const router = useRouter()
  const { speak } = useTextToSpeech()
  const { navigateToStep } = useStepNavigation()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [showExitModal, setShowExitModal] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('manifestation_type')
    if (saved) {
      setSelectedType(saved)
    }
  }, [])

  const handleSelectType = (typeId: string) => {
    const typeData =
      AUDIO_TEXTS.manifestationType[
        typeId as keyof typeof AUDIO_TEXTS.manifestationType
      ]

    // Read the option text
    speak(getAudioText(typeData))

    // Store selected type
    setSelectedType(typeId)
    localStorage.setItem('manifestation_type', typeId)
  }

  const handleNext = () => {
    if (selectedType) {
      router.push('/manifestacao/assunto')
    }
  }

  const handleBack = () => {
    // Check if there's filled data that should trigger exit confirmation
    const hasData = selectedType || localStorage.getItem('manifestation_type')
    if (hasData) {
      setShowExitModal(true)
    } else {
      router.push('/')
    }
  }

  const handleConfirmExit = () => {
    setShowExitModal(false)
    router.push('/')
  }

  const handleSaveAndExit = () => {
    // TODO: Implement save draft logic
    setShowExitModal(false)
    router.push('/')
  }

  return (
    <>
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Container */}
      <div className="lg:hidden min-h-screen bg-background pb-40">
        {/* Header - Mobile only */}
        <AccessibleHeader
          currentStep={STEPS.TYPE}
          totalSteps={STEPS.TOTAL}
          completedSteps={COMPLETED_STEPS.AT_TYPE}
        />

        {/* Main Content */}
        <main className="px-4 py-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold text-foreground">
                Qual tipo de manifestação?
              </h2>
              <button
                onClick={() =>
                  speak(
                    `Qual tipo de manifestação? ${AUDIO_TEXTS.instructions.typeSelection}`
                  )
                }
                className="size-5 rounded-full bg-secondary hover:bg-secondary-hover flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Ouvir instruções"
              >
                <RiVolumeUpLine className="size-3 text-white" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              {AUDIO_TEXTS.instructions.typeSelection}
            </p>
          </div>

          {/* Types List */}
          <div className="space-y-3">
            {manifestationTypes.map(type => {
              const Icon = type.icon
              const isSelected = selectedType === type.id
              return (
                <button
                  key={type.id}
                  onClick={() => handleSelectType(type.id)}
                  className={`w-full bg-card rounded-lg p-3 text-left flex items-center gap-3 hover:bg-accent transition-all ${
                    isSelected ? 'border-2 border-success' : 'card-border'
                  }`}
                >
                  <div
                    className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="size-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-0.5">
                      {type.label}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="size-6 bg-success rounded-full flex items-center justify-center flex-shrink-0">
                      <RiCheckLine className="size-4 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </main>

        {/* Footer */}
        <NavigationFooter
          currentStep={STEPS.TYPE}
          totalSteps={STEPS.TOTAL}
          onBack={handleBack}
          onNext={handleNext}
          onNavigateToStep={navigateToStep}
          nextDisabled={!selectedType}
          showAnonymousInfo={false}
          steps={getStepProgress(STEPS.TYPE)}
        />
      </div>

      {/* Desktop Container */}
      <div className="hidden lg:block min-h-screen bg-background">
        <main className="lg:max-w-3xl lg:mx-auto lg:px-8 lg:py-16">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-1 flex-1 bg-muted rounded-full">
                <div className="h-full w-1/5 bg-success rounded-full" />
              </div>
              <div className="h-1 flex-1 bg-muted rounded-full" />
              <div className="h-1 flex-1 bg-muted rounded-full" />
              <div className="h-1 flex-1 bg-muted rounded-full" />
              <div className="h-1 flex-1 bg-muted rounded-full" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Passo 1 de 5
            </p>
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-semibold text-foreground mb-3">
              Qual tipo de manifestação?
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {AUDIO_TEXTS.instructions.typeSelection}
            </p>
          </div>

          {/* Types Grid */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            {manifestationTypes.map(type => {
              const Icon = type.icon
              const isSelected = selectedType === type.id
              return (
                <button
                  key={type.id}
                  onClick={() => handleSelectType(type.id)}
                  className={`bg-card border-2 rounded-xl p-6 text-left flex flex-col items-start gap-3 transition-all hover:border-secondary/50 ${
                    isSelected
                      ? 'border-success ring-2 ring-success/20'
                      : 'border-border'
                  }`}
                >
                  <div
                    className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="size-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {type.label}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="size-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 ml-auto">
                      <RiCheckLine className="size-4 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <button
              onClick={handleBack}
              className="px-6 py-3 text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedType}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                !selectedType
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary-hover'
              }`}
            >
              Continuar
            </button>
          </div>
        </main>
      </div>

      {/* Exit Confirmation Modal */}
      <ExitConfirmModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onSaveAndExit={handleSaveAndExit}
        onExitWithoutSaving={handleConfirmExit}
      />
    </>
  )
}

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
    router.push('/')
  }

  return (
    <>
      {/* Desktop Header */}
      <DesktopHeader />

      <div className="min-h-screen bg-background pb-40">
        {/* Header - Mobile only */}
        <AccessibleHeader
          currentStep={STEPS.TYPE}
          totalSteps={STEPS.TOTAL}
          completedSteps={COMPLETED_STEPS.AT_TYPE}
        />

        {/* Main Content */}
        <main className="px-4 py-6 lg:max-w-4xl lg:mx-auto">
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
                  className={`w-full bg-card rounded-lg p-3 btn-hover text-left flex items-center gap-3 hover:shadow-md transition-all ${
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
    </>
  )
}

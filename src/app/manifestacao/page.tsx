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
  RiArrowRightLine,
} from 'react-icons/ri'
import { AccessibleHeader } from '@/features/manifestation/components/AccessibleHeader'
import { NavigationFooter } from '@/features/manifestation/components/NavigationFooter'
import { FormSidebar } from '@/features/manifestation/components/FormSidebar'
import { ExitConfirmModal } from '@/shared/components/ExitConfirmModal'
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { Button } from '@/shared/components/Button'
import { ManifestationHeader } from '@/shared/components/Stepper'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/Select'
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
    shortDesc: 'Irregularidades',
  },
  {
    id: 'reclamacao',
    ...AUDIO_TEXTS.manifestationType.reclamacao,
    icon: RiErrorWarningLine,
    color: 'bg-type-reclamacao',
    shortDesc: 'Insatisfação',
  },
  {
    id: 'sugestao',
    ...AUDIO_TEXTS.manifestationType.sugestao,
    icon: RiLightbulbLine,
    color: 'bg-type-sugestao',
    shortDesc: 'Melhorias',
  },
  {
    id: 'elogio',
    ...AUDIO_TEXTS.manifestationType.elogio,
    icon: RiChatSmile3Line,
    color: 'bg-type-elogio',
    shortDesc: 'Reconhecimento',
  },
  {
    id: 'solicitacao',
    ...AUDIO_TEXTS.manifestationType.solicitacao,
    icon: RiQuestionLine,
    color: 'bg-type-solicitacao',
    shortDesc: 'Requisitar serviço',
  },
  {
    id: 'informacao',
    ...AUDIO_TEXTS.manifestationType.informacao,
    icon: RiInformationLine,
    color: 'bg-type-informacao',
    shortDesc: 'Dados públicos',
  },
]

export default function ManifestationTypePage() {
  const router = useRouter()
  const { speak } = useTextToSpeech()
  const { navigateToStep } = useStepNavigation()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [showExitModal, setShowExitModal] = useState(false)

  // Load saved type on mount
  useEffect(() => {
    const savedType = localStorage.getItem('manifestation_type')
    if (savedType) {
      setSelectedType(savedType)
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
              <h1 className="text-xl font-bold text-foreground">
                Qual tipo de manifestação?
              </h1>
              <button
                onClick={() =>
                  speak(
                    `Qual tipo de manifestação? ${AUDIO_TEXTS.instructions.typeSelection}`
                  )
                }
                className="size-5 rounded-full bg-secondary hover:bg-secondary-hover flex items-center justify-center transition-colors flex-shrink-0 btn-focus"
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
                  className={`w-full bg-card rounded-lg p-3 text-left flex items-center gap-3 hover:bg-accent transition-all btn-focus ${
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
          steps={getStepProgress(STEPS.TYPE)}
          backLabel="Cancelar"
          backVariant="destructive"
        />
      </div>

      {/* Desktop Container */}
      <div className="hidden lg:block min-h-screen bg-background">
        <div className="grid grid-cols-[1fr_600px_1fr] gap-12 py-12 px-8">
          {/* Coluna Esquerda - Sidebar */}
          <div className="flex justify-end">
            <FormSidebar
              helpText="Selecione o tipo de manifestação que melhor descreve sua solicitação. Esta informação ajuda a direcionar seu caso para o setor responsável."
            />
          </div>

          {/* Coluna Central - Main Content (sempre centralizado) */}
          <main className="w-full">
          <ManifestationHeader
            currentStep={STEPS.TYPE}
            totalSteps={STEPS.TOTAL}
            description="Selecione o tipo de manifestação desejada."
            onStepClick={navigateToStep}
          />

          {/* Types Select */}
          <div className="mb-8">
            <label
              htmlFor="manifestation-type"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Tipo de manifestação
            </label>
            <Select value={selectedType || ''} onValueChange={handleSelectType}>
              <SelectTrigger id="manifestation-type">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {manifestationTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm">{type.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {type.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button variant="destructive" onClick={handleBack}>
              Cancelar
            </Button>
            <Button variant="success" onClick={handleNext} disabled={!selectedType}>
              Avançar
              <RiArrowRightLine className="size-5" />
            </Button>
          </div>
          </main>

          {/* Coluna Direita - Vazia (para manter centralização) */}
          <div />
        </div>
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

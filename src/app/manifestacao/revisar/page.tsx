'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RiEditLine, RiVolumeUpLine } from 'react-icons/ri'
import { AccessibleHeader } from '@/features/manifestation/components/AccessibleHeader'
import { NavigationFooter } from '@/features/manifestation/components/NavigationFooter'
import { getStepProgress } from '@/shared/utils/stepProgress'
import { useStepNavigation } from '@/shared/hooks/useStepNavigation'
import { DURATION, STEPS } from '@/shared/constants/designTokens'

interface ManifestationData {
  type: string
  channel: string
  content: string
  isAnonymous: boolean
  personalData?: {
    name: string
    email: string
    phone: string
  }
}

const typeLabels: Record<string, string> = {
  denuncia: 'Denúncia',
  reclamacao: 'Reclamação',
  sugestao: 'Sugestão',
  elogio: 'Elogio',
  solicitacao: 'Solicitação',
}

const channelLabels: Record<string, string> = {
  texto: 'Texto',
  audio: 'Áudio',
  imagem: 'Imagem',
  video: 'Vídeo',
}

export default function ReviewPage() {
  const router = useRouter()
  const { navigateToStep } = useStepNavigation()
  const [data, setData] = useState<ManifestationData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const type = localStorage.getItem('manifestation_type') || ''
    const channel = localStorage.getItem('manifestation_channel') || ''
    const content = localStorage.getItem('manifestation_content') || ''
    const isAnonymous =
      localStorage.getItem('manifestation_anonymous') === 'true'
    const personalDataStr = localStorage.getItem('manifestation_personal_data')

    setData({
      type,
      channel,
      content,
      isAnonymous,
      personalData: personalDataStr ? JSON.parse(personalDataStr) : undefined,
    })
  }, [])

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, DURATION.FONT_LEVEL_DISPLAY))

    // Generate protocol
    const protocol = `${new Date().toISOString().split('T')[0]?.replace(/-/g, '') ?? ''}-${Math.floor(1000 + Math.random() * 9000)}`

    // Store protocol
    localStorage.setItem('last_protocol', protocol)

    // Clear form data
    localStorage.removeItem('manifestation_type')
    localStorage.removeItem('manifestation_channel')
    localStorage.removeItem('manifestation_content')
    localStorage.removeItem('manifestation_anonymous')
    localStorage.removeItem('manifestation_personal_data')

    // Navigate to confirmation
    router.push(`/manifestacao/protocolo/${protocol}`)
  }

  const handleBack = () => {
    router.push('/manifestacao/dados')
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-40">
      {/* Header */}
      <AccessibleHeader currentStep={STEPS.REVIEW} totalSteps={STEPS.TOTAL} completedSteps={COMPLETED_STEPS.AT_REVIEW} />

      {/* Main Content */}
      <main className="px-4 py-6 space-y-4">
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-bold text-foreground">
              Revise sua manifestação
            </h2>
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel()
                  const utterance = new SpeechSynthesisUtterance(
                    'Revise sua manifestação. Confira se todas as informações estão corretas'
                  )
                  utterance.lang = 'pt-BR'
                  window.speechSynthesis.speak(utterance)
                }
              }}
              className="size-5 rounded-full bg-secondary hover:bg-secondary-hover flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Ouvir instruções"
            >
              <RiVolumeUpLine className="size-3 text-white" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Confira se todas as informações estão corretas
          </p>
        </div>

        {/* Type */}
        <div className="bg-card rounded-lg p-4 card-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">Tipo</h3>
            <Link
              href="/manifestacao"
              className="text-secondary hover:text-secondary-hover"
            >
              <RiEditLine className="size-4" />
            </Link>
          </div>
          <p className="text-foreground">
            {typeLabels[data.type] || data.type}
          </p>
        </div>

        {/* Channel */}
        <div className="bg-card rounded-lg p-4 card-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">Canal</h3>
            <Link
              href="/manifestacao/canal"
              className="text-secondary hover:text-secondary-hover"
            >
              <RiEditLine className="size-4" />
            </Link>
          </div>
          <p className="text-foreground">
            {channelLabels[data.channel] || data.channel}
          </p>
        </div>

        {/* Content */}
        <div className="bg-card rounded-lg p-4 card-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">Conteúdo</h3>
            <Link
              href="/manifestacao/conteudo"
              className="text-secondary hover:text-secondary-hover"
            >
              <RiEditLine className="size-4" />
            </Link>
          </div>
          <p className="text-foreground text-sm whitespace-pre-wrap">
            {data.content}
          </p>
        </div>

        {/* Personal Data */}
        <div className="bg-card rounded-lg p-4 card-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">
              Identificação
            </h3>
            <Link
              href="/manifestacao/dados"
              className="text-secondary hover:text-secondary-hover"
            >
              <RiEditLine className="size-4" />
            </Link>
          </div>
          {data.isAnonymous ? (
            <p className="text-foreground">Manifestação anônima</p>
          ) : (
            <div className="space-y-1 text-sm">
              <p className="text-foreground">
                <strong>Nome:</strong> {data.personalData?.name}
              </p>
              {data.personalData?.email && (
                <p className="text-foreground">
                  <strong>Email:</strong> {data.personalData.email}
                </p>
              )}
              {data.personalData?.phone && (
                <p className="text-foreground">
                  <strong>Telefone:</strong> {data.personalData.phone}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Confirmation Info */}
        <div className="bg-accent rounded-lg p-4">
          <p className="text-xs text-accent-foreground">
            ✓ Ao confirmar, sua manifestação será registrada e você receberá um
            protocolo para acompanhamento.
          </p>
        </div>
      </main>

      {/* Footer */}
      <NavigationFooter
        currentStep={STEPS.REVIEW}
        totalSteps={STEPS.TOTAL}
        onBack={handleBack}
        onNext={handleSubmit}
        onNavigateToStep={navigateToStep}
        nextDisabled={isSubmitting}
        showAnonymousInfo={false}
        steps={getStepProgress(STEPS.REVIEW)}
      />
    </div>
  )
}

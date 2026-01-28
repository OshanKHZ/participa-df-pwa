'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  RiEditLine,
  RiVolumeUpLine,
  RiImageLine,
  RiVideoLine,
  RiMicLine,
} from 'react-icons/ri'
import { AccessibleHeader } from '@/features/manifestation/components/AccessibleHeader'
import { NavigationFooter } from '@/features/manifestation/components/NavigationFooter'
import { getStepProgress } from '@/shared/utils/stepProgress'
import { useStepNavigation } from '@/shared/hooks/useStepNavigation'
import { STEPS, COMPLETED_STEPS } from '@/shared/constants/designTokens'

interface AttachmentInfo {
  hasAudio: boolean
  audioCount: number
  hasFiles: boolean
  fileCount: number
  fileTypes: string[]
}

interface ManifestationData {
  type: string
  channel: string
  content: string
  subject?: string
  isAnonymous: boolean
  attachments?: AttachmentInfo
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
    const subject = localStorage.getItem('manifestation_subject_name') || ''
    const isAnonymous =
      localStorage.getItem('manifestation_anonymous') === 'true'
    const personalDataStr = localStorage.getItem('manifestation_personal_data')
    const attachmentsStr = localStorage.getItem('manifestation_attachments')

    const attachments: AttachmentInfo | undefined = attachmentsStr
      ? JSON.parse(attachmentsStr)
      : undefined

    setData({
      type,
      channel,
      content,
      subject,
      isAnonymous,
      attachments,
      personalData: personalDataStr ? JSON.parse(personalDataStr) : undefined,
    })
  }, [])

  const handleSubmit = async () => {
    if (!data) return

    setIsSubmitting(true)

    try {
      const { createManifestation } = await import('../actions')
      const result = await createManifestation({
        type: data.type,
        content: data.content,
        subject: data.subject,
        attachments: data.attachments,
        isAnonymous: data.isAnonymous,
      })

      if (result.success && result.protocol) {
        const protocol = result.protocol

        // Store protocol for reference if needed locally, though standard flow is redirection
        localStorage.setItem('last_protocol', protocol)

        // Clear form data
        localStorage.removeItem('manifestation_type')
        localStorage.removeItem('manifestation_channel')
        localStorage.removeItem('manifestation_channels')
        localStorage.removeItem('manifestation_content')
        localStorage.removeItem('manifestation_subject_id')
        localStorage.removeItem('manifestation_subject_name')
        localStorage.removeItem('manifestation_attachments')
        localStorage.removeItem('manifestation_anonymous')
        localStorage.removeItem('manifestation_personal_data')

        // Navigate to confirmation
        router.push(`/manifestacao/protocolo/${protocol}`)
      } else {
        console.error('Failed to submit:', result.error)
        alert('Ocorreu um erro ao enviar sua manifestação. Tente novamente.')
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('Erro inesperado ao enviar. Verifique sua conexão.')
    } finally {
      setIsSubmitting(false)
    }
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
      <AccessibleHeader
        currentStep={STEPS.REVIEW}
        totalSteps={STEPS.TOTAL}
        completedSteps={COMPLETED_STEPS.AT_REVIEW}
      />

      {/* Main Content */}
      <main className="px-4 py-6 space-y-3">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-bold text-foreground">
              Revisar manifestação
            </h2>
            <button
              onClick={() => {
                if (
                  typeof window !== 'undefined' &&
                  'speechSynthesis' in window
                ) {
                  window.speechSynthesis.cancel()
                  const utterance = new SpeechSynthesisUtterance(
                    'Revisar manifestação. Confira se todas as informações estão corretas'
                  )
                  utterance.lang = 'pt-BR'
                  window.speechSynthesis.speak(utterance)
                }
              }}
              className="size-5 rounded-full bg-secondary hover:bg-secondary-hover flex items-center justify-center transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
              aria-label="Ouvir instruções"
            >
              <RiVolumeUpLine className="size-3 text-white" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Confira as informações antes de enviar
          </p>
        </div>

        {/* Type */}
        <div className="bg-card rounded-sm p-4 card-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Tipo</h3>
            <Link
              href="/manifestacao"
              className="text-secondary hover:text-secondary-hover transition-colors"
              aria-label="Editar tipo"
            >
              <RiEditLine className="size-4" />
            </Link>
          </div>
          <p className="text-foreground font-medium">
            {typeLabels[data.type] || data.type}
          </p>
        </div>

        {/* Channel - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block bg-card rounded-sm p-4 card-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Canal</h3>
            <Link
              href="/manifestacao/canal"
              className="text-secondary hover:text-secondary-hover transition-colors"
              aria-label="Editar canal"
            >
              <RiEditLine className="size-4" />
            </Link>
          </div>
          <p className="text-foreground font-medium">
            {channelLabels[data.channel] || data.channel}
          </p>
        </div>

        {/* Subject */}
        <div className="bg-card rounded-sm p-4 card-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Assunto
            </h3>
            <Link
              href="/manifestacao/assunto"
              className="text-secondary hover:text-secondary-hover transition-colors"
              aria-label="Editar assunto"
            >
              <RiEditLine className="size-4" />
            </Link>
          </div>
          <p className="text-foreground font-medium">
            {data.subject || 'Não selecionado'}
          </p>
        </div>

        {/* Content */}
        <div className="bg-card rounded-sm p-4 card-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Conteúdo
            </h3>
            <Link
              href="/manifestacao/conteudo"
              className="text-secondary hover:text-secondary-hover transition-colors"
              aria-label="Editar conteúdo"
            >
              <RiEditLine className="size-4" />
            </Link>
          </div>
          {data.content && (
            <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap break-words">
              {data.content}
            </p>
          )}
          {data.attachments &&
            (data.attachments.hasAudio || data.attachments.hasFiles) && (
              <div
                className={`space-y-2 ${data.content ? 'mt-3 pt-3 border-t border-border' : ''}`}
              >
                {data.attachments.hasAudio && (
                  <div className="flex items-center gap-2 bg-secondary/5 rounded px-3 py-2">
                    <RiMicLine className="size-4 text-secondary flex-shrink-0" />
                    <span className="text-sm text-foreground">
                      {data.attachments.audioCount} áudio
                      {data.attachments.audioCount > 1 ? 's' : ''} gravado
                      {data.attachments.audioCount > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                {data.attachments.hasFiles && (
                  <div className="flex items-center gap-2 bg-secondary/5 rounded px-3 py-2">
                    {data.attachments.fileTypes.some(t =>
                      t.startsWith('image/')
                    ) ? (
                      <RiImageLine className="size-4 text-secondary flex-shrink-0" />
                    ) : (
                      <RiVideoLine className="size-4 text-secondary flex-shrink-0" />
                    )}
                    <span className="text-sm text-foreground">
                      {data.attachments.fileCount} arquivo
                      {data.attachments.fileCount > 1 ? 's' : ''} anexado
                      {data.attachments.fileCount > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            )}
          {!data.content &&
            !data.attachments?.hasAudio &&
            !data.attachments?.hasFiles && (
              <p className="text-muted-foreground text-sm italic">
                Sem conteúdo
              </p>
            )}
        </div>

        {/* Personal Data */}
        <div className="bg-card rounded-sm p-4 card-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Identificação
            </h3>
            <Link
              href="/manifestacao/dados"
              className="text-secondary hover:text-secondary-hover transition-colors"
              aria-label="Editar identificação"
            >
              <RiEditLine className="size-4" />
            </Link>
          </div>
          {data.isAnonymous ? (
            <p className="text-foreground font-medium">Anônima</p>
          ) : (
            <div className="space-y-1.5 text-sm">
              <p className="text-foreground">
                <span className="text-muted-foreground">Nome:</span>{' '}
                <span className="font-medium">{data.personalData?.name}</span>
              </p>
              {data.personalData?.email && (
                <p className="text-foreground">
                  <span className="text-muted-foreground">Email:</span>{' '}
                  <span className="font-medium">{data.personalData.email}</span>
                </p>
              )}
              {data.personalData?.phone && (
                <p className="text-foreground">
                  <span className="text-muted-foreground">Telefone:</span>{' '}
                  <span className="font-medium">{data.personalData.phone}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Confirmation Info */}
        <div className="bg-primary/5 border border-primary/20 rounded-sm p-4 mt-4">
          <p className="text-xs text-foreground leading-relaxed">
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
        steps={getStepProgress(STEPS.REVIEW)}
      />
    </div>
  )
}

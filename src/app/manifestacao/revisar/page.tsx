'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  RiEditLine,
  RiArrowRightLine,
  RiImageLine,
  RiVideoLine,
  RiMicLine,
  RiCheckLine,
} from 'react-icons/ri'
import { AccessibleHeader } from '@/features/manifestation/components/AccessibleHeader'
import { NavigationFooter } from '@/features/manifestation/components/NavigationFooter'
import { FormSidebar } from '@/features/manifestation/components/FormSidebar'
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { Button } from '@/shared/components/Button'
import { ManifestationHeader } from '@/shared/components/Stepper'
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
    router.push('/manifestacao/conteudo')
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Container */}
      <div className="lg:hidden min-h-screen bg-background pb-40">
        {/* Header */}
        <AccessibleHeader
          currentStep={STEPS.REVIEW}
          totalSteps={STEPS.TOTAL}
          completedSteps={COMPLETED_STEPS.AT_REVIEW}
        />

        {/* Main Content */}
        <main id="main-content" className="px-4 py-6 space-y-3">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-foreground">
              Revisar manifestação
            </h1>
            <p className="text-sm text-muted-foreground">
              Confira as informações antes de enviar
            </p>
          </div>

          {/* Type */}
          <div className="bg-card rounded-sm p-4 card-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Tipo
              </h3>
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
                      <RiMicLine
                        className="size-4 text-secondary flex-shrink-0"
                        aria-hidden="true"
                      />
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
                        <RiImageLine
                          className="size-4 text-secondary flex-shrink-0"
                          aria-hidden="true"
                        />
                      ) : (
                        <RiVideoLine
                          className="size-4 text-secondary flex-shrink-0"
                          aria-hidden="true"
                        />
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
                href="/manifestacao/identidade"
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
                    <span className="font-medium">
                      {data.personalData.email}
                    </span>
                  </p>
                )}
                {data.personalData?.phone && (
                  <p className="text-foreground">
                    <span className="text-muted-foreground">Telefone:</span>{' '}
                    <span className="font-medium">
                      {data.personalData.phone}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Confirmation Info */}
          <div className="bg-primary/5 border border-primary/20 rounded-sm p-4 mt-4">
            <p className="text-xs text-foreground leading-relaxed">
              ✓ Ao confirmar, sua manifestação será registrada e você receberá
              um protocolo para acompanhamento.
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
          nextLoading={isSubmitting}
          steps={getStepProgress(STEPS.REVIEW)}
        />
      </div>

      {/* Desktop Container */}
      <div className="hidden lg:block min-h-screen bg-background">
        <div className="grid grid-cols-[1fr_700px_1fr] gap-12 py-12 px-8">
          {/* Coluna Esquerda - Sidebar */}
          <div className="flex justify-end">
            <FormSidebar helpText="Revise todas as informações antes de enviar. Certifique-se de que todos os dados estão corretos para que sua manifestação seja processada adequadamente." />
          </div>

          {/* Coluna Central - Main Content (sempre centralizado) */}
          <main id="main-content" className="w-full">
            <ManifestationHeader
              currentStep={STEPS.REVIEW}
              totalSteps={STEPS.TOTAL}
              description="Confira todas as informações antes de enviar sua manifestação."
              title="Revisar manifestação"
              onStepClick={navigateToStep}
            />

            {/* Two Column Layout */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {/* Left Column - Main Info */}
              <div className="col-span-2 space-y-4">
                {/* Type Card */}
                <div className="bg-card border border-border rounded-xl p-6 hover:border-secondary/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-secondary">
                            1
                          </span>
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          Tipo
                        </h3>
                      </div>
                      <p className="text-lg font-semibold text-foreground">
                        {typeLabels[data.type] || data.type}
                      </p>
                    </div>
                    <Link
                      href="/manifestacao"
                      className="p-2 rounded-lg hover:bg-accent transition-colors text-secondary hover:text-secondary-hover"
                      aria-label="Editar tipo"
                    >
                      <RiEditLine className="size-5" />
                    </Link>
                  </div>
                </div>

                {/* Subject Card */}
                <div className="bg-card border border-border rounded-xl p-6 hover:border-secondary/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-secondary">
                            2
                          </span>
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          Assunto
                        </h3>
                      </div>
                      <p className="text-lg font-semibold text-foreground">
                        {data.subject || 'Não selecionado'}
                      </p>
                    </div>
                    <Link
                      href="/manifestacao/assunto"
                      className="p-2 rounded-lg hover:bg-accent transition-colors text-secondary hover:text-secondary-hover"
                      aria-label="Editar assunto"
                    >
                      <RiEditLine className="size-5" />
                    </Link>
                  </div>
                </div>

                {/* Content Card */}
                <div className="bg-card border border-border rounded-xl p-6 hover:border-secondary/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-secondary">
                          3
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Conteúdo
                      </h3>
                    </div>
                    <Link
                      href="/manifestacao/conteudo"
                      className="p-2 rounded-lg hover:bg-accent transition-colors text-secondary hover:text-secondary-hover"
                      aria-label="Editar conteúdo"
                    >
                      <RiEditLine className="size-5" />
                    </Link>
                  </div>

                  {data.content && (
                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                        {data.content}
                      </p>
                    </div>
                  )}

                  {data.attachments &&
                    (data.attachments.hasAudio ||
                      data.attachments.hasFiles) && (
                      <div className="flex flex-wrap gap-2">
                        {data.attachments.hasAudio && (
                          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary rounded-lg px-3 py-2">
                            <RiMicLine className="size-4" />
                            <span className="text-sm font-medium">
                              {data.attachments.audioCount} áudio
                              {data.attachments.audioCount > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                        {data.attachments.hasFiles && (
                          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary rounded-lg px-3 py-2">
                            {data.attachments.fileTypes.some(t =>
                              t.startsWith('image/')
                            ) ? (
                              <RiImageLine className="size-4" />
                            ) : (
                              <RiVideoLine className="size-4" />
                            )}
                            <span className="text-sm font-medium">
                              {data.attachments.fileCount} arquivo
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
                        Sem conteúdo adicionado
                      </p>
                    )}
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="col-span-1 space-y-4">
                {/* Identification Card */}
                <div className="bg-card border border-border rounded-xl p-6 hover:border-secondary/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-secondary">
                          4
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Identificação
                      </h3>
                    </div>
                    <Link
                      href="/manifestacao/identidade"
                      className="p-2 rounded-lg hover:bg-accent transition-colors text-secondary hover:text-secondary-hover"
                      aria-label="Editar identificação"
                    >
                      <RiEditLine className="size-5" />
                    </Link>
                  </div>

                  {data.isAnonymous ? (
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <p className="font-semibold text-foreground">Anônima</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Sem identificação
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                          Nome
                        </p>
                        <p className="font-medium text-foreground">
                          {data.personalData?.name}
                        </p>
                      </div>
                      {data.personalData?.email && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            Email
                          </p>
                          <p className="font-medium text-foreground">
                            {data.personalData.email}
                          </p>
                        </div>
                      )}
                      {data.personalData?.phone && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            Telefone
                          </p>
                          <p className="font-medium text-foreground">
                            {data.personalData.phone}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirmation Notice */}
                <div className="bg-success/5 border border-success/20 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <RiCheckLine className="size-5 text-success" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Pronto para enviar
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Ao confirmar, sua manifestação será registrada e você
                        receberá um protocolo para acompanhamento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <Button variant="link" onClick={handleBack}>
                Voltar e editar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="min-w-[200px]"
              >
                {isSubmitting ? (
                  <>
                    <span>Enviando...</span>
                    <div className="ml-2 size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </>
                ) : (
                  <>
                    <span>Confirmar e enviar</span>
                    <RiArrowRightLine className="size-5" />
                  </>
                )}
              </Button>
            </div>
          </main>

          {/* Coluna Direita - Vazia (para manter centralização) */}
          <div />
        </div>
      </div>
    </>
  )
}

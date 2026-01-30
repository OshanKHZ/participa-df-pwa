'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  RiEditLine,
  RiArrowRightLine,
  RiImageLine,
  RiVideoLine,
  RiMicLine,
  RiZoomInLine,
  RiFileTextLine,
} from 'react-icons/ri'
import { AccessibleHeader } from '@/features/manifestation/components/AccessibleHeader'
import { NavigationFooter } from '@/features/manifestation/components/NavigationFooter'
import { FormSidebar } from '@/features/manifestation/components/FormSidebar'
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { Button } from '@/shared/components/Button'
import { ManifestationHeader } from '@/features/manifestation/components/ManifestationStepper'
import { FilePreviewModal } from '@/shared/components/FilePreviewModal'
import { getStepProgress } from '@/shared/utils/stepProgress'
import { useStepNavigation } from '@/shared/hooks/useStepNavigation'
import { useDraftPersistence } from '@/shared/hooks/useDraftPersistence'
import { STORAGE_KEYS } from '@/shared/constants/storageKeys'
import { STEPS, COMPLETED_STEPS } from '@/shared/constants/designTokens'
import type { FileWithPreview } from '@/shared/hooks/useFileUpload'

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
  // Actual file/audio data from IndexedDB
  files?: File[]
  audio?: Blob
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
  const { loadDraft, deleteDraft, draftId } = useDraftPersistence()
  const [data, setData] = useState<ManifestationData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewFile, setPreviewFile] = useState<{
    file: File
    index: number
  } | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const type = localStorage.getItem('manifestation_type') || ''
      const channel = localStorage.getItem('manifestation_channel') || ''
      const content = localStorage.getItem('manifestation_content') || ''
      const subject = localStorage.getItem('manifestation_subject_name') || ''
      const isAnonymous =
        localStorage.getItem('manifestation_anonymous') === 'true'
      const personalDataStr = localStorage.getItem(
        'manifestation_personal_data'
      )
      const attachmentsStr = localStorage.getItem('manifestation_attachments')

      const attachments: AttachmentInfo | undefined = attachmentsStr
        ? JSON.parse(attachmentsStr)
        : undefined

      // Try to load files and audio from IndexedDB
      let files: File[] | undefined
      let audio: Blob | undefined

      try {
        const draftId = localStorage.getItem(STORAGE_KEYS.currentDraftId)
        if (draftId) {
          const draft = await loadDraft(draftId)
          if (draft) {
            files = draft.content?.files
            audio = draft.content?.audio
          }
        }
      } catch (e) {
        console.error('Error loading draft from IndexedDB:', e)
      }

      setData({
        type,
        channel,
        content,
        subject,
        isAnonymous,
        attachments,
        personalData: personalDataStr ? JSON.parse(personalDataStr) : undefined,
        files,
        audio,
      })
    }

    loadData()

    // Listen for focus to refresh data (handles back/forward navigation cache)
    window.addEventListener('focus', loadData)
    return () => window.removeEventListener('focus', loadData)
  }, [loadDraft])

  const files = useMemo(() => data?.files || [], [data?.files])

  const audioUrl = useMemo(() => {
    if (data?.audio) {
      return URL.createObjectURL(data.audio)
    }
    return null
  }, [data?.audio])

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const openPreview = (file: File, index: number) => {
    setPreviewFile({ file, index })
  }

  const closePreview = () => {
    setPreviewFile(null)
  }

  const handleNextPreview = useCallback(() => {
    if (!previewFile || files.length === 0) return
    const newIndex = (previewFile.index + 1) % files.length
    const nextFile = files[newIndex]
    if (nextFile) {
      setPreviewFile({ file: nextFile, index: newIndex })
    }
  }, [files, previewFile])

  const handlePrevPreview = useCallback(() => {
    if (!previewFile || files.length === 0) return
    const newIndex = (previewFile.index - 1 + files.length) % files.length
    const prevFile = files[newIndex]
    if (prevFile) {
      setPreviewFile({ file: prevFile, index: newIndex })
    }
  }, [files, previewFile])

  const handleSubmit = async () => {
    if (!data) return

    setIsSubmitting(true)

    try {
      const { createManifestation } = await import('@/app/actions/manifestation')
      const result = await createManifestation({
        type: data.type,
        content: data.content,
        subject: data.subject,
        attachments: data.attachments,
        isAnonymous: data.isAnonymous,
      })

      if (result.success && result.protocol) {
        const protocol = result.protocol

        // Delete draft if exists
        if (draftId) {
          await deleteDraft(draftId)
        }

        localStorage.setItem('last_protocol', protocol)

        localStorage.removeItem('manifestation_type')
        localStorage.removeItem('manifestation_channel')
        localStorage.removeItem('manifestation_channels')
        localStorage.removeItem('manifestation_content')
        localStorage.removeItem('manifestation_subject_id')
        localStorage.removeItem('manifestation_subject_name')
        localStorage.removeItem('manifestation_attachments')
        localStorage.removeItem('manifestation_anonymous')
        localStorage.removeItem('manifestation_personal_data')

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
      <DesktopHeader />

      {/* Mobile Container */}
      <div className="lg:hidden min-h-screen bg-background pb-40">
        <AccessibleHeader
          currentStep={STEPS.REVIEW}
          totalSteps={STEPS.TOTAL}
          completedSteps={COMPLETED_STEPS.AT_REVIEW}
        />

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

            {/* Mobile Attachments Preview */}
            {(audioUrl || files.length > 0 || data.attachments) &&
              (data.attachments?.hasAudio ||
                data.attachments?.hasFiles ||
                audioUrl ||
                files.length > 0) && (
                <div
                  className={`space-y-2 ${data.content ? 'mt-3 pt-3 border-t border-border' : ''}`}
                >
                  {/* Audio Player */}
                  {audioUrl && (
                    <div className="bg-secondary/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <RiMicLine className="size-4 text-secondary" />
                        <span className="text-sm font-medium text-foreground">
                          Áudio gravado
                        </span>
                      </div>
                      <audio controls src={audioUrl} className="w-full h-8" />
                    </div>
                  )}

                  {/* Files Grid */}
                  {files.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {files.map((file, idx) => {
                        const isImage = file.type.startsWith('image/')
                        const isVideo = file.type.startsWith('video/')
                        const previewUrl =
                          isImage || isVideo ? URL.createObjectURL(file) : null

                        return (
                          <div
                            key={idx}
                            className="relative aspect-video bg-muted rounded-lg overflow-hidden border border-border"
                            onClick={() =>
                              (isImage || isVideo) && openPreview(file, idx)
                            }
                          >
                            {previewUrl ? (
                              <>
                                {isImage ? (
                                  <img
                                    src={previewUrl}
                                    className="w-full h-full object-cover"
                                    alt={file.name}
                                  />
                                ) : (
                                  <video
                                    src={previewUrl}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <RiFileTextLine className="text-2xl text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Fallback: Show metadata if no actual files loaded */}
                  {!audioUrl && files.length === 0 && data.attachments && (
                    <>
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
                    </>
                  )}
                </div>
              )}

            {!data.content &&
              !audioUrl &&
              files.length === 0 &&
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
        </main>

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
          {/* Left Sidebar */}
          <div className="flex justify-end">
            <FormSidebar helpText="Revise todas as informações antes de enviar." />
          </div>

          {/* Main Content */}
          <main id="main-content" className="w-full">
            <ManifestationHeader
              currentStep={STEPS.REVIEW}
              totalSteps={STEPS.TOTAL}
              title="Revisar manifestação"
              description="Confira todas as informações antes de enviar."
              onStepClick={navigateToStep}
            />

            {/* Main Card */}
            <div className="bg-card border border-border rounded-sm p-8 mb-6">
              {/* Form Fields - Simple Layout */}
              <div className="space-y-8">
                {/* Row 1: Type and Subject */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-foreground">Tipo</h3>
                      <Link
                        href="/manifestacao"
                        className="text-secondary hover:text-secondary-hover"
                        aria-label="Editar tipo"
                      >
                        <RiEditLine className="size-4" />
                      </Link>
                    </div>
                    <p className="text-foreground">
                      {typeLabels[data.type] || data.type}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-foreground">Assunto</h3>
                      <Link
                        href="/manifestacao/assunto"
                        className="text-secondary hover:text-secondary-hover"
                        aria-label="Editar assunto"
                      >
                        <RiEditLine className="size-4" />
                      </Link>
                    </div>
                    <p className="text-foreground">
                      {data.subject || 'Não selecionado'}
                    </p>
                  </div>
                </div>

                {/* Row 2: Content */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-foreground">Conteúdo</h3>
                    <Link
                      href="/manifestacao/conteudo"
                      className="text-secondary hover:text-secondary-hover"
                      aria-label="Editar conteúdo"
                    >
                      <RiEditLine className="size-4" />
                    </Link>
                  </div>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap break-words">
                    {data.content || (
                      <span className="text-muted-foreground italic">
                        Sem conteúdo
                      </span>
                    )}
                  </p>
                </div>

                {/* Row 3: Identification */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-foreground">Identificação</h3>
                    <Link
                      href="/manifestacao/identidade"
                      className="text-secondary hover:text-secondary-hover"
                      aria-label="Editar identificação"
                    >
                      <RiEditLine className="size-4" />
                    </Link>
                  </div>
                  {data.isAnonymous ? (
                    <p className="text-foreground">Manifestação anônima</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Nome
                        </p>
                        <p className="text-foreground">
                          {data.personalData?.name}
                        </p>
                      </div>
                      {data.personalData?.email && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Email
                          </p>
                          <p className="text-foreground">
                            {data.personalData.email}
                          </p>
                        </div>
                      )}
                      {data.personalData?.phone && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Telefone
                          </p>
                          <p className="text-foreground">
                            {data.personalData.phone}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Attachments Section */}
                {(audioUrl || files.length > 0 || data.attachments) && (
                  <div className="border-t border-border pt-6">
                    <h3 className="font-bold text-foreground mb-4">Anexos</h3>

                    <div className="space-y-4">
                      {/* Audio Player */}
                      {audioUrl && (
                        <div className="bg-secondary/5 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <RiMicLine className="size-5 text-secondary" />
                            <span className="font-medium text-foreground">
                              Áudio gravado
                            </span>
                          </div>
                          <audio
                            controls
                            src={audioUrl}
                            className="w-full h-10"
                          />
                        </div>
                      )}

                      {/* Files Grid */}
                      {files.length > 0 && (
                        <div className="grid grid-cols-4 gap-3">
                          {files.map((file, idx) => {
                            const isImage = file.type.startsWith('image/')
                            const isVideo = file.type.startsWith('video/')
                            const previewUrl =
                              isImage || isVideo
                                ? URL.createObjectURL(file)
                                : null

                            return (
                              <div
                                key={idx}
                                className="group relative aspect-video bg-muted rounded-lg overflow-hidden border border-border hover:border-secondary/50 transition-colors cursor-pointer"
                                onClick={() =>
                                  (isImage || isVideo) && openPreview(file, idx)
                                }
                              >
                                {previewUrl ? (
                                  <>
                                    {isImage ? (
                                      <img
                                        src={previewUrl}
                                        className="w-full h-full object-cover"
                                        alt={file.name}
                                      />
                                    ) : (
                                      <video
                                        src={previewUrl}
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <RiZoomInLine className="text-white size-6" />
                                    </div>
                                  </>
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                                    <RiFileTextLine size={24} />
                                    <span className="text-xs mt-1">
                                      {file.type.split('/')[1]}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Fallback: Show metadata if no actual files loaded */}
                      {!audioUrl && files.length === 0 && data.attachments && (
                        <div className="flex flex-wrap gap-3">
                          {data.attachments.hasAudio && (
                            <div className="inline-flex items-center gap-2 text-foreground">
                              <RiMicLine className="size-5 text-secondary" />
                              <span>
                                {data.attachments.audioCount} áudio
                                {data.attachments.audioCount > 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                          {data.attachments.hasFiles && (
                            <div className="inline-flex items-center gap-2 text-foreground">
                              {data.attachments.fileTypes.some(t =>
                                t.startsWith('image/')
                              ) ? (
                                <RiImageLine className="size-5 text-secondary" />
                              ) : (
                                <RiVideoLine className="size-5 text-secondary" />
                              )}
                              <span>
                                {data.attachments.fileCount} arquivo
                                {data.attachments.fileCount > 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <Button variant="link" onClick={handleBack}>
                Voltar e editar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                variant="success"
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

          {/* Right Sidebar (empty for symmetry) */}
          <div />
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreviewModal
          file={(() => {
            const fileWithPreview = previewFile.file as FileWithPreview
            if (!fileWithPreview.preview) {
              fileWithPreview.preview = URL.createObjectURL(previewFile.file)
            }
            return fileWithPreview
          })()}
          index={previewFile.index}
          total={files.length}
          onClose={closePreview}
          onNext={handleNextPreview}
          onPrevious={handlePrevPreview}
        />
      )}
    </>
  )
}

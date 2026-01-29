'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  RiTextWrap,
  RiMicLine,
  RiImageAddLine,
  RiArrowRightLine,
  RiZoomInLine,
} from 'react-icons/ri'
import { AccessibleHeader } from '@/features/manifestation/components/AccessibleHeader'
import { NavigationFooter } from '@/features/manifestation/components/NavigationFooter'
import { FormSidebar } from '@/features/manifestation/components/FormSidebar'
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { Button } from '@/shared/components/Button'
import { ManifestationHeader } from '@/shared/components/Stepper'
import { MultiSelectGrid } from '@/shared/components/MultiSelectGrid'
import { TextInput } from '@/shared/components/TextInput'
import { AudioRecorder } from '@/shared/components/AudioRecorder'
import { FileUploader } from '@/shared/components/FileUploader'
import { FilePreviewModal } from '@/shared/components/FilePreviewModal'
import { getStepProgress } from '@/shared/utils/stepProgress'
import { useStepNavigation } from '@/shared/hooks/useStepNavigation'
import { useDraftPersistence } from '@/shared/hooks/useDraftPersistence'
import { useFileUpload } from '@/shared/hooks/useFileUpload'
import { useAudioRecorder } from '@/shared/hooks/useAudioRecorder'
import { STORAGE_KEYS } from '@/shared/constants/storageKeys'
import {
  LIMITS,
  STEPS,
  COMPLETED_STEPS,
} from '@/shared/constants/designTokens'

const channels = [
  {
    id: 'texto',
    label: 'Prefiro escrever',
    icon: RiTextWrap,
  },
  {
    id: 'audio',
    label: 'Desejo falar',
    icon: RiMicLine,
  },
  {
    id: 'arquivos',
    label: 'Tenho fotos ou vídeos',
    icon: RiImageAddLine,
  },
]

const acceptedFileTypes =
  '.pdf,.png,.jpg,.jpeg,.webp,.mp3,.wav,.ogg,.mp4,.webm,.mov'

export default function ContentPage() {
  const router = useRouter()
  const { navigateToStep } = useStepNavigation()

  // Channel selection state
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['texto'])

  // Text content state
  const [textContent, setTextContent] = useState('')
  const [charCount, setCharCount] = useState(0)

  // Audio recording - using custom hook (shared between mobile and desktop)
  const audioRecorder = useAudioRecorder({
    maxAudios: LIMITS.MAX_AUDIO_COUNT,
    maxDuration: LIMITS.MAX_AUDIO_DURATION_SECONDS,
  })

  // File upload - using custom hook (shared between mobile and desktop)
  const fileUpload = useFileUpload({
    maxFiles: LIMITS.MAX_FILE_COUNT,
    acceptedTypes: acceptedFileTypes,
  })

  const {
    files,
    previewFile,
    previewIndex,
    handleFileUpload,
    removeFile,
    openPreview,
    closePreview,
    nextPreview,
    prevPreview,
  } = fileUpload

  const { audioBlobs } = audioRecorder

  // Get current draft ID from localStorage
  const currentDraftId =
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.currentDraftId) || undefined
      : undefined

  // Draft persistence hook
  const { saveField, loadDraft } = useDraftPersistence({
    autoSave: true,
    debounceMs: 1000,
    draftId: currentDraftId,
  })

  // Load saved data on mount
  useEffect(() => {
    const savedChannels = localStorage.getItem('manifestation_channels')
    if (savedChannels) {
      setSelectedChannels(JSON.parse(savedChannels))
    }

    const savedContent = localStorage.getItem('manifestation_content')
    if (savedContent) {
      setTextContent(savedContent)
      setCharCount(savedContent.length)
    }

    // Load saved draft from IndexedDB
    const loadSavedDraft = async () => {
      try {
        const savedDraftId = localStorage.getItem(STORAGE_KEYS.currentDraftId)
        if (savedDraftId) {
          const draft = await loadDraft(savedDraftId)
          if (draft?.content?.files) {
            // Restore files with previews
            // Note: useFileUpload manages its own state, so this would need to be integrated differently
            // For now, this is left as a TODO for proper integration
            void draft.content.files
          }
        }
      } catch (e) {
        console.error('Error loading draft from IndexedDB:', e)
      }
    }

    loadSavedDraft()
  }, [loadDraft])

  // Save draft when content changes
  useEffect(() => {
    saveField('content.text', textContent)
  }, [textContent, saveField])

  const handleTextChange = (value: string) => {
    setTextContent(value)
    setCharCount(value.length)
  }

  const handleToggleChannel = (channelId: string) => {
    setSelectedChannels(prev => {
      if (prev.includes(channelId)) {
        return prev.filter(id => id !== channelId)
      }
      return [...prev, channelId]
    })
  }

  const handleNext = () => {
    localStorage.setItem('manifestation_content', textContent)

    // Save attachment info
    const attachmentInfo = {
      hasAudio: audioBlobs.length > 0,
      audioCount: audioBlobs.length,
      hasFiles: files.length > 0,
      fileCount: files.length,
      fileTypes: files.map(f => f.type),
    }
    localStorage.setItem(
      'manifestation_attachments',
      JSON.stringify(attachmentInfo)
    )

    router.push('/manifestacao/dados')
  }

  const handleBack = () => {
    router.push('/manifestacao/assunto')
  }

  const hasContent =
    charCount >= LIMITS.MIN_TEXT_CHARS ||
    audioBlobs.length > 0 ||
    files.length > 0

  return (
    <>
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Container */}
      <div className="lg:hidden min-h-screen bg-background pb-40">
        {/* Header */}
        <AccessibleHeader
          currentStep={STEPS.CONTENT}
          totalSteps={STEPS.TOTAL}
          completedSteps={COMPLETED_STEPS.AT_CONTENT}
        />

        {/* Main Content */}
        <main id="main-content" className="px-4 py-4 space-y-4">
          {/* Channel Selector */}
          <MultiSelectGrid
            items={channels}
            selectedIds={selectedChannels}
            onToggle={handleToggleChannel}
            storageKey="manifestation_channels"
          />

          {/* Text Section */}
          {selectedChannels.includes('texto') && (
            <div className="bg-card rounded-lg p-3 card-border">
              <TextInput
                id="manifestation-text"
                label="Descrição *"
                value={textContent}
                onChange={handleTextChange}
                placeholder="Descreva o que aconteceu..."
                minLength={LIMITS.MIN_TEXT_CHARS}
                maxLength={LIMITS.MAX_TEXT_CHARS}
              />
            </div>
          )}

          {/* Audio Section */}
          {selectedChannels.includes('audio') && (
            <div className="bg-card rounded-lg p-3 card-border">
              <AudioRecorder
                audioRecorder={audioRecorder}
                compact
              />
            </div>
          )}

          {/* Files Section */}
          {selectedChannels.includes('arquivos') && (
            <div className="bg-card rounded-lg p-3 card-border">
              <FileUploader
                fileUpload={fileUpload}
                hint="Formatos: PNG, JPG, WEBP, MP3, WAV, MP4, WEBM, PDF"
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <NavigationFooter
          currentStep={STEPS.CONTENT}
          totalSteps={STEPS.TOTAL}
          onBack={handleBack}
          onNext={handleNext}
          onNavigateToStep={navigateToStep}
          nextDisabled={!hasContent}
          steps={getStepProgress(STEPS.CONTENT)}
        />
      </div>

      {/* Desktop Container */}
      <div className="hidden lg:block min-h-screen bg-background">
        <div className="grid grid-cols-[1fr_600px_1fr] gap-12 py-12 px-8">
          {/* Coluna Esquerda - Sidebar */}
          <div className="flex justify-end">
            <FormSidebar
              helpText="Descreva sua manifestação com detalhes. Você pode usar texto, áudio ou anexar arquivos para ilustrar melhor sua solicitação."
            />
          </div>

          {/* Coluna Central - Main Content (sempre centralizado) */}
          <main id="main-content" className="w-full">
          <ManifestationHeader
            currentStep={STEPS.CONTENT}
            totalSteps={STEPS.TOTAL}
            description="Descreva sua manifestação com o máximo de detalhes possível."
          />

          <div className="space-y-8">
            {/* Text Section */}
            <TextInput
              id="desktop-text"
              label="Descrição da manifestação"
              value={textContent}
              onChange={handleTextChange}
              placeholder="Descreva sua manifestação aqui..."
              minLength={LIMITS.MIN_TEXT_CHARS}
              maxLength={LIMITS.MAX_TEXT_CHARS}
              textareaClassName="min-h-48 p-4 border-2 border-border rounded-lg resize-y btn-focus focus:border-secondary"
            />

            {/* Audio Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Gravar áudio (opcional)
              </label>
              <div className="border-2 border-border rounded-lg p-4">
                <AudioRecorder audioRecorder={audioRecorder} />
              </div>
            </div>

            {/* Files Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Anexar arquivos (opcional)
              </label>
              <div className="border-2 border-border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept={acceptedFileTypes}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex-1 text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                  >
                    {files.length === 0
                      ? 'Nenhum arquivo selecionado'
                      : `${files.length} arquivo(s) anexado(s)`}
                  </label>
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-hover transition-colors text-sm font-medium cursor-pointer ml-3"
                  >
                    Anexar
                  </label>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Formatos: PNG, JPG, WEBP, MP3, WAV, MP4, WEBM, PDF • Máx.{' '}
                {LIMITS.MAX_FILE_COUNT} arquivos
              </p>

              {files.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {files.map((file, index) => {
                    const fileType = file.type.startsWith('image/')
                      ? 'image'
                      : file.type.startsWith('video/')
                        ? 'video'
                        : file.type.startsWith('audio/')
                          ? 'audio'
                          : 'document'
                    const isMedia = ['image', 'video', 'audio'].includes(fileType)

                    return (
                      <div
                        key={index}
                        className="border-2 border-border rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => isMedia && openPreview(file, index)}
                      >
                        <div className="relative group aspect-video bg-muted">
                          {file.preview && isMedia ? (
                            <>
                              {fileType === 'image' && (
                                <img
                                  src={file.preview}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              {fileType === 'video' && (
                                <video
                                  src={file.preview}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              {fileType === 'audio' && (
                                <div className="w-full h-full flex items-center justify-center bg-accent">
                                  <RiMicLine className="size-6 text-muted-foreground" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <RiZoomInLine className="size-6 text-white" />
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-accent p-2">
                              <span className="text-3xl">📎</span>
                            </div>
                          )}
                        </div>
                        <div className="px-2 py-1.5 bg-card flex items-center justify-between gap-1">
                          <span
                            className="text-xs text-foreground truncate flex-1"
                            title={file.name}
                          >
                            {file.name}
                          </span>
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              removeFile(index)
                            }}
                            className="text-destructive hover:text-destructive/80 ml-2 cursor-pointer btn-focus p-1 text-lg leading-none"
                            aria-label={`Remover arquivo ${file.name}`}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
            <Button variant="link" onClick={handleBack}>
              Voltar
            </Button>
            <Button onClick={handleNext} disabled={!hasContent}>
              Avançar
              <RiArrowRightLine className="size-5" />
            </Button>
          </div>
          </main>

          {/* Coluna Direita - Vazia (para manter centralização) */}
          <div />
        </div>
      </div>

      {/* Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        index={previewIndex}
        total={files.length}
        onClose={closePreview}
        onNext={nextPreview}
        onPrevious={prevPreview}
      />
    </>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  RiTextWrap,
  RiMicLine,
  RiFileAddLine,
  RiCloseLine,
  RiArrowRightLine,
  RiArrowRightSLine,
  RiArrowLeftLine,
  RiZoomInLine,
  RiImageAddLine,
} from 'react-icons/ri'
import { AccessibleHeader } from '@/features/manifestation/components/AccessibleHeader'
import { NavigationFooter } from '@/features/manifestation/components/NavigationFooter'
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { Button } from '@/shared/components/Button'
import { Stepper, getDesktopSteps } from '@/shared/components/Stepper'
import { getStepProgress } from '@/shared/utils/stepProgress'
import { useStepNavigation } from '@/shared/hooks/useStepNavigation'
import { useDraftPersistence } from '@/shared/hooks/useDraftPersistence'
import { STORAGE_KEYS } from '@/shared/constants/storageKeys'
import {
  LIMITS,
  STEPS,
  DURATION,
  COMPLETED_STEPS,
} from '@/shared/constants/designTokens'

const channels = [
  {
    id: 'texto',
    label: 'Prefiro escrever',
    description: 'Vou escrever minha manifestação',
    icon: RiTextWrap,
  },
  {
    id: 'audio',
    label: 'Desejo falar',
    description: 'Vou gravar um áudio explicando',
    icon: RiMicLine,
  },
  {
    id: 'arquivos',
    label: 'Tenho fotos ou vídeos',
    description: 'Vou enviar arquivos de imagem ou vídeo',
    icon: RiImageAddLine,
  },
]

type FileWithPreview = File & { preview?: string }

export default function ContentPage() {
  const router = useRouter()
  const { navigateToStep } = useStepNavigation()
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['texto'])
  const [textContent, setTextContent] = useState('')
  const [charCount, setCharCount] = useState(0)

  // Audio recording state - support multiple audios
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlobs, setAudioBlobs] = useState<Blob[]>([])
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const maxAudios = LIMITS.MAX_AUDIO_COUNT

  // Files state
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [previewFile, setPreviewFile] = useState<FileWithPreview | null>(null)
  const [previewIndex, setPreviewIndex] = useState(0)

  const minChars = LIMITS.MIN_TEXT_CHARS
  const maxChars = LIMITS.MAX_TEXT_CHARS
  const maxAudioDuration = LIMITS.MAX_AUDIO_DURATION_SECONDS
  const maxFiles = LIMITS.MAX_FILE_COUNT

  // Accepted file types
  const acceptedFileTypes = {
    documents: '.pdf',
    images: '.png,.jpg,.jpeg,.webp',
    audio: '.mp3,.wav,.ogg',
    video: '.mp4,.webm,.mov',
  }

  const allAcceptedTypes = Object.values(acceptedFileTypes).join(',')

  // Get current draft ID from localStorage (for continuing existing drafts)
  const currentDraftId = typeof window !== 'undefined'
    ? localStorage.getItem(STORAGE_KEYS.currentDraftId) || undefined
    : undefined

  // Draft persistence hook
  const { saveField, loadDraft } = useDraftPersistence({
    autoSave: true,
    debounceMs: 1000,
    draftId: currentDraftId,
  })

  useEffect(() => {
    const savedChannels = localStorage.getItem('manifestation_channels')
    if (savedChannels) {
      const channels = JSON.parse(savedChannels)
      setSelectedChannels(channels)
    }

    const savedContent = localStorage.getItem('manifestation_content')
    if (savedContent) {
      setTextContent(savedContent)
      setCharCount(savedContent.length)
    }

    // Load saved draft from IndexedDB (includes files with blobs)
    const loadSavedDraft = async () => {
      try {
        const savedDraftId = localStorage.getItem(STORAGE_KEYS.currentDraftId)
        if (savedDraftId) {
          const draft = await loadDraft(savedDraftId)
          if (draft?.content?.files) {
            // Restore files with previews
            const filesWithPreview = draft.content.files.map(file => {
              const fileWithPreview = file as FileWithPreview
              if (
                file.type.startsWith('image/') ||
                file.type.startsWith('video/') ||
                file.type.startsWith('audio/')
              ) {
                fileWithPreview.preview = URL.createObjectURL(file)
              }
              return fileWithPreview
            })
            setFiles(filesWithPreview)
          }
          if (draft?.content?.audio) {
            // Audio restoration would go here if needed
          }
        }
      } catch (e) {
        console.error('Error loading draft from IndexedDB:', e)
      }
    }

    loadSavedDraft()

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [loadDraft])

  // Save draft when files change (using IndexedDB)
  useEffect(() => {
    saveField('content.files', files)
  }, [files, saveField])

  // Save draft when text changes
  useEffect(() => {
    saveField('content.text', textContent)
  }, [textContent, saveField])

  // Cleanup blob URLs when files change
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file?.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= maxChars) {
      setTextContent(text)
      setCharCount(text.length)
    }
  }

  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlobs(prev => [...prev, blob])
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxAudioDuration) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, DURATION.TIMER_INTERVAL)
    } catch {
      alert('Erro ao acessar microfone. Verifique as permissões.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setRecordingTime(0) // Reset timer for next recording
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const deleteAudio = (index: number) => {
    setAudioBlobs(prev => prev.filter((_, i) => i !== index))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // File upload functions
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const validFiles = selectedFiles.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase()
      return allAcceptedTypes.includes(extension)
    })

    if (files.length + validFiles.length > maxFiles) {
      alert(`Você pode enviar no máximo ${maxFiles} arquivos`)
      return
    }

    const filesWithPreview = validFiles.map(file => {
      const fileWithPreview = file as FileWithPreview
      if (
        file.type.startsWith('image/') ||
        file.type.startsWith('video/') ||
        file.type.startsWith('audio/')
      ) {
        fileWithPreview.preview = URL.createObjectURL(file)
      }
      return fileWithPreview
    })

    setFiles(prev => [...prev, ...filesWithPreview])
  }

  const removeFile = (index: number) => {
    setFiles(prev => {
      const file = prev[index]
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      // Close preview if removing the currently viewed file
      if (file === previewFile) {
        setPreviewFile(null)
      }
      return prev.filter((_, i) => i !== index)
    })
  }

  const openPreview = (file: FileWithPreview, index: number) => {
    setPreviewFile(file)
    setPreviewIndex(index)
  }

  const closePreview = () => {
    setPreviewFile(null)
  }

  const nextPreview = () => {
    const mediaFiles = files.filter(
      f =>
        f.type.startsWith('image/') ||
        f.type.startsWith('video/') ||
        f.type.startsWith('audio/')
    )
    const currentIndex = mediaFiles.findIndex(f => f === previewFile)
    const nextIndex = (currentIndex + 1) % mediaFiles.length
    setPreviewFile(mediaFiles[nextIndex] as FileWithPreview)
    setPreviewIndex(files.indexOf(mediaFiles[nextIndex] as FileWithPreview))
  }

  const prevPreview = () => {
    const mediaFiles = files.filter(
      f =>
        f.type.startsWith('image/') ||
        f.type.startsWith('video/') ||
        f.type.startsWith('audio/')
    )
    const currentIndex = mediaFiles.findIndex(f => f === previewFile)
    const prevIndex = (currentIndex - 1 + mediaFiles.length) % mediaFiles.length
    setPreviewFile(mediaFiles[prevIndex] as FileWithPreview)
    setPreviewIndex(files.indexOf(mediaFiles[prevIndex] as FileWithPreview))
  }

  const getFileType = (file: File) => {
    if (!file?.type) return 'document'
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.startsWith('video/')) return 'video'
    if (file.type.startsWith('audio/')) return 'audio'
    return 'document'
  }

  // PDF icon component - using provided image
  const PdfIcon = () => (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
      alt="PDF"
      className="size-12"
    />
  )

  const getFileIcon = (file: File) => {
    if (!file?.type) return <span className="text-xl">📎</span>
    if (file.type.startsWith('image/'))
      return <span className="text-xl">🖼️</span>
    if (file.type.startsWith('video/'))
      return <span className="text-xl">🎥</span>
    if (file.type.startsWith('audio/'))
      return <span className="text-xl">🎵</span>
    if (file.type.includes('pdf')) return <PdfIcon />
    return <span className="text-xl">📎</span>
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
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
    localStorage.setItem('manifestation_attachments', JSON.stringify(attachmentInfo))

    router.push('/manifestacao/dados')
  }

  const handleBack = () => {
    router.push('/manifestacao/assunto')
  }

  const hasContent =
    charCount >= minChars || audioBlobs.length > 0 || files.length > 0

  // Handle keyboard navigation in preview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!previewFile) return
      if (e.key === 'ArrowRight') nextPreview()
      if (e.key === 'ArrowLeft') prevPreview()
      if (e.key === 'Escape') closePreview()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [previewFile])

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
        <main className="px-4 py-4 space-y-4">
          {/* Channel Selector */}
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground mb-2">
              Como você prefere contar?
            </p>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {channels.map(channel => {
                const Icon = channel.icon
                const isSelected = selectedChannels.includes(channel.id)

                return (
                  <button
                    key={channel.id}
                    onClick={() => {
                      setSelectedChannels(prev => {
                        if (prev.includes(channel.id)) {
                          const newChannels = prev.filter(
                            id => id !== channel.id
                          )
                          localStorage.setItem(
                            'manifestation_channels',
                            JSON.stringify(newChannels)
                          )
                          return newChannels
                        } else {
                          const newChannels = [...prev, channel.id]
                          localStorage.setItem(
                            'manifestation_channels',
                            JSON.stringify(newChannels)
                          )
                          return newChannels
                        }
                      })
                    }}
                    className={`bg-card rounded-lg p-2 card-border text-center transition-all ${
                      isSelected ? 'ring-2 ring-secondary' : 'hover:bg-accent'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 border-2 rounded-lg flex items-center justify-center mx-auto mb-1 ${
                        isSelected ? 'border-secondary' : 'border-border'
                      }`}
                    >
                      <Icon
                        className={`size-4 ${isSelected ? 'text-secondary' : 'text-muted-foreground'}`}
                      />
                    </div>
                    <p
                      className={`text-xs font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      {channel.label}
                    </p>
                  </button>
                )
              })}
            </div>
            {selectedChannels.length > 0 && (
              <div className="text-xs text-success">
                ✓ {selectedChannels.length}{' '}
                {selectedChannels.length === 1 ? 'selecionado' : 'selecionados'}
              </div>
            )}
          </div>

          {/* Texto Section */}
          {selectedChannels.includes('texto') && (
            <div className="bg-card rounded-lg p-3 card-border">
              <label htmlFor="manifestation-text" className="block text-sm font-medium text-foreground mb-2">
                Descrição *
              </label>
              <textarea
                id="manifestation-text"
                value={textContent}
                onChange={handleTextChange}
                placeholder="Descreva o que aconteceu..."
                aria-describedby="char-feedback"
                className="w-full min-h-32 p-3 border card-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
              />
              <div
                className="flex items-center justify-between mt-2 text-xs"
                id="char-feedback"
              >
                <span
                  className={
                    charCount < minChars
                      ? 'text-destructive'
                      : 'text-success'
                  }
                >
                  {charCount < minChars
                    ? `Mínimo ${minChars}`
                    : '✓ Pronto'}
                </span>
                <span className="text-muted-foreground">
                  {charCount} / {maxChars}
                </span>
              </div>
            </div>
          )}

          {/* Áudio Section - Compact */}
          {selectedChannels.includes('audio') && (
            <div className="bg-card rounded-lg p-3 card-border">
              <p className="text-sm font-medium text-foreground mb-2">
                Gravar áudio
              </p>
              {audioBlobs.length < maxAudios && (
                <div className="flex items-center gap-2">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-secondary text-white rounded-lg text-sm"
                    >
                      <RiMicLine className="size-4" />
                      {isRecording ? 'Gravando...' : 'Gravar'}
                    </button>
                  ) : (
                    <>
                      <span className="text-sm font-mono">{formatTime(recordingTime)}</span>
                      <button onClick={stopRecording} className="px-3 py-2 bg-destructive text-white rounded-lg text-xs">
                        Parar
                      </button>
                    </>
                  )}
                </div>
              )}
              {audioBlobs.length > 0 && (
                <div className="mt-2 space-y-2">
                  {audioBlobs.map((blob, index) => (
                    <div key={index} className="flex items-center gap-2 bg-success/10 rounded p-2">
                      <audio controls className="flex-1 h-8" src={URL.createObjectURL(blob)} />
                      <button onClick={() => deleteAudio(index)} className="text-destructive p-1">
                        <RiCloseLine className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Arquivos Section */}
          {selectedChannels.includes('arquivos') && (
            <div className="bg-card rounded-lg p-3 card-border">
              <p className="text-sm font-medium text-foreground mb-2">
                Anexar arquivos
              </p>
              <label className="block">
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-accent transition-colors">
                  <RiFileAddLine className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">
                    Clique para selecionar (até {maxFiles})
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept={allAcceptedTypes}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {files.length > 0 && (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {files.map((file, index) => {
                    const fileType = getFileType(file)
                    const isMedia =
                      fileType === 'image' ||
                      fileType === 'video' ||
                      fileType === 'audio'
                    const thumbnail = file.preview || undefined

                    return (
                      <div key={index} className="border-2 border-border rounded-lg overflow-hidden">
                        {/* Thumbnail */}
                        <div
                          className={`relative group aspect-video bg-muted ${isMedia ? 'cursor-pointer' : ''}`}
                          onClick={() => isMedia && openPreview(file, index)}
                        >
                          {thumbnail && isMedia ? (
                            <>
                              {fileType === 'image' && (
                                <img
                                  src={thumbnail}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              {fileType === 'video' && (
                                <video
                                  src={thumbnail}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              {fileType === 'audio' && (
                                <div className="w-full h-full flex items-center justify-center bg-accent">
                                  <RiMicLine className="size-6 text-muted-foreground" />
                                </div>
                              )}
                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <RiZoomInLine className="size-6 text-white" />
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-accent p-2">
                              <span className="text-2xl">{getFileIcon(file)}</span>
                            </div>
                          )}
                        </div>

                        {/* Info bar */}
                        <div className="px-2 py-1.5 bg-card flex items-center justify-between gap-1">
                          <span className="text-xs text-foreground truncate flex-1" title={file.name}>
                            {file.name}
                          </span>
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              removeFile(index)
                            }}
                            className="text-destructive hover:text-destructive/80 ml-1 cursor-pointer"
                          >
                            <RiCloseLine className="size-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
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
        <main className="lg:max-w-3xl lg:mx-auto lg:px-8 lg:py-12">
          {/* Progress Steps */}
          <div className="mb-10">
            <Stepper steps={getDesktopSteps(STEPS.CONTENT)} />
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Nova Manifestação
            </h1>
            <p className="text-muted-foreground">
              Descreva sua manifestação com o máximo de detalhes possível.
            </p>
          </div>

          <div className="space-y-8">
            {/* Text Section */}
            <div className="space-y-3">
              <label
                htmlFor="desktop-text"
                className="block text-sm font-medium text-foreground"
              >
                Descrição da manifestação
              </label>
              <textarea
                id="desktop-text"
                value={textContent}
                onChange={handleTextChange}
                placeholder="Descreva sua manifestação aqui..."
                className="w-full min-h-48 p-4 border-2 border-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
              />
              <div className="flex items-center justify-between text-xs">
                <span
                  className={
                    charCount < minChars ? 'text-destructive' : 'text-success'
                  }
                >
                  {charCount < minChars
                    ? `Mínimo ${minChars} caracteres`
                    : '✓ Mínimo atingido'}
                </span>
                <span
                  className={
                    charCount > maxChars * 0.9
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                  }
                >
                  {charCount} / {maxChars}
                </span>
              </div>
            </div>

            {/* Audio Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Gravar áudio (opcional)
              </label>

              {/* Recording controls */}
              <div className="border-2 border-border rounded-lg p-4">
                <div className="flex items-center gap-4">
                  {isRecording && (
                    <span className="text-sm font-mono text-foreground">
                      {formatTime(recordingTime)}
                    </span>
                  )}
                  <div className="flex gap-2 ml-auto">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-hover transition-colors text-sm font-medium"
                      >
                        Gravar
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={stopRecording}
                          className="px-4 py-2 bg-destructive text-white rounded hover:opacity-90 transition-colors text-sm font-medium"
                        >
                          Parar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Audio list */}
              {audioBlobs.length > 0 && (
                <div className="space-y-2">
                  {audioBlobs.map((blob, index) => (
                    <div
                      key={index}
                      className="border-2 border-border rounded-lg p-2"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">
                          Áudio {index + 1}
                        </span>
                        <button
                          onClick={() => deleteAudio(index)}
                          className="text-xs text-destructive hover:underline cursor-pointer"
                        >
                          Remover
                        </button>
                      </div>
                      <audio
                        controls
                        className="w-full h-8"
                        src={URL.createObjectURL(blob)}
                      />
                    </div>
                  ))}
                </div>
              )}
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
                    accept={allAcceptedTypes}
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
                {maxFiles} arquivos
              </p>

              {files.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {files.map((file, index) => {
                    const fileType = getFileType(file)
                    const isMedia =
                      fileType === 'image' ||
                      fileType === 'video' ||
                      fileType === 'audio'
                    const thumbnail = file.preview || undefined

                    return (
                      <div
                        key={index}
                        className="border-2 border-border rounded-lg overflow-hidden"
                      >
                        {/* Thumbnail - com group apenas aqui */}
                        <div
                          className={`relative group aspect-video bg-muted ${isMedia ? 'cursor-pointer' : ''}`}
                          onClick={() => isMedia && openPreview(file, index)}
                        >
                          {thumbnail && isMedia ? (
                            <>
                              {fileType === 'image' && (
                                <img
                                  src={thumbnail}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              {fileType === 'video' && (
                                <video
                                  src={thumbnail}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              {fileType === 'audio' && (
                                <div className="w-full h-full flex items-center justify-center bg-accent">
                                  <RiMicLine className="size-6 text-muted-foreground" />
                                </div>
                              )}
                              {/* Hover overlay - apenas dentro do thumbnail */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <RiZoomInLine className="size-6 text-white" />
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-accent p-2">
                              <span className="text-3xl">
                                {getFileIcon(file)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info bar - fora do group, sem hover interference */}
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
                            className="text-destructive hover:text-destructive/80 ml-2 cursor-pointer"
                          >
                            <RiCloseLine className="size-4" />
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
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={closePreview}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closePreview}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Fechar"
            >
              <RiCloseLine className="size-8" />
            </button>

            {/* Content */}
            <div className="bg-black rounded-lg overflow-hidden">
              {getFileType(previewFile) === 'image' && previewFile.preview && (
                <img
                  src={previewFile.preview}
                  alt={previewFile.name}
                  className="max-h-[80vh] max-w-full object-contain mx-auto"
                />
              )}
              {getFileType(previewFile) === 'video' && previewFile.preview && (
                <video
                  src={previewFile.preview}
                  controls
                  className="max-h-[80vh] max-w-full mx-auto"
                  autoPlay
                />
              )}
              {getFileType(previewFile) === 'audio' && (
                <div className="p-8 flex flex-col items-center justify-center">
                  <audio
                    src={previewFile.preview}
                    controls
                    autoPlay
                    className="w-full max-w-md"
                  />
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={prevPreview}
                className="text-white hover:text-gray-300 transition-colors flex items-center gap-2"
              >
                <RiArrowLeftLine className="size-8" />
                Anterior
              </button>
              <span className="text-white text-sm">
                {previewIndex + 1} / {files.length}
              </span>
              <button
                onClick={nextPreview}
                className="text-white hover:text-gray-300 transition-colors flex items-center gap-2"
              >
                Próximo
                <RiArrowRightSLine className="size-8" />
              </button>
            </div>

            {/* File info */}
            <div className="mt-2 text-center">
              <p className="text-white text-sm truncate">{previewFile.name}</p>
              <p className="text-gray-400 text-xs">
                {formatFileSize(previewFile.size)}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

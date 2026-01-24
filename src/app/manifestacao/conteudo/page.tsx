'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  RiTextWrap,
  RiMicLine,
  RiFileAddLine,
  RiCloseLine,
  RiPlayCircleLine,
  RiPauseCircleLine,
  RiStopCircleLine,
  RiVolumeUpLine,
} from 'react-icons/ri'
import { AccessibleHeader } from '@/features/manifestation/components/AccessibleHeader'
import { NavigationFooter } from '@/features/manifestation/components/NavigationFooter'
import { getStepProgress } from '@/shared/utils/stepProgress'
import { useStepNavigation } from '@/shared/hooks/useStepNavigation'
import { useTextToSpeech } from '@/shared/hooks/useTextToSpeech'
import {
  LIMITS,
  STEPS,
  DURATION,
  COMPLETED_STEPS,
} from '@/shared/constants/designTokens'

type FileWithPreview = File & { preview?: string }

export default function ContentPage() {
  const router = useRouter()
  const { navigateToStep } = useStepNavigation()
  const { speak } = useTextToSpeech()
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['texto'])
  const [activeTab, setActiveTab] = useState('texto')
  const [textContent, setTextContent] = useState('')
  const [charCount, setCharCount] = useState(0)

  // Audio recording state - support multiple audios
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [audioBlobs, setAudioBlobs] = useState<Blob[]>([])
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const maxAudios = LIMITS.MAX_AUDIO_COUNT

  // Files state
  const [files, setFiles] = useState<FileWithPreview[]>([])

  const minChars = LIMITS.MIN_TEXT_CHARS
  const maxChars = LIMITS.MAX_TEXT_CHARS
  const maxAudioDuration = LIMITS.MAX_AUDIO_DURATION_SECONDS
  const maxFiles = LIMITS.MAX_FILE_COUNT

  // Accepted file types
  const acceptedFileTypes = {
    documents: '.pdf,.docx,.xlsx',
    images: '.png,.jpg,.jpeg',
    audio: '.mp3',
    video: '.mp4',
  }

  const allAcceptedTypes = Object.values(acceptedFileTypes).join(',')

  useEffect(() => {
    const savedChannels = localStorage.getItem('manifestation_channels')
    if (savedChannels) {
      const channels = JSON.parse(savedChannels)
      setSelectedChannels(channels)

      // Set initial tab based on selected channels
      if (channels.includes('texto') || channels.includes('audio')) {
        setActiveTab('texto-audio')
      } else if (channels.includes('arquivos')) {
        setActiveTab('arquivos')
      }
    }

    const savedContent = localStorage.getItem('manifestation_content')
    if (savedContent) {
      setTextContent(savedContent)
      setCharCount(savedContent.length)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

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
      setIsPaused(false)

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

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxAudioDuration) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, DURATION.TIMER_INTERVAL)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
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
      if (file.type.startsWith('image/')) {
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
      return prev.filter((_, i) => i !== index)
    })
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return '🖼️'
    if (file.type.startsWith('video/')) return '🎥'
    if (file.type.startsWith('audio/')) return '🎵'
    if (file.type.includes('pdf')) return '📄'
    if (file.type.includes('word') || file.type.includes('document'))
      return '📝'
    if (file.type.includes('sheet') || file.type.includes('excel')) return '📊'
    return '📎'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleNext = () => {
    localStorage.setItem('manifestation_content', textContent)
    router.push('/manifestacao/dados')
  }

  const handleBack = () => {
    router.push('/manifestacao/canal')
  }

  const hasContent =
    charCount >= minChars || audioBlobs.length > 0 || files.length > 0

  const tabConfig = {
    'texto-audio': { label: 'Texto/Áudio', icon: RiTextWrap },
    arquivos: { label: 'Arquivos', icon: RiFileAddLine },
  }

  // Group texto and audio together
  const hasTextoOrAudio =
    selectedChannels.includes('texto') || selectedChannels.includes('audio')
  const hasArquivos = selectedChannels.includes('arquivos')

  const effectiveTabs = []
  if (hasTextoOrAudio) effectiveTabs.push('texto-audio')
  if (hasArquivos) effectiveTabs.push('arquivos')

  return (
    <div className="min-h-screen bg-background pb-40">
      {/* Header */}
      <AccessibleHeader
        currentStep={STEPS.CONTENT}
        totalSteps={STEPS.TOTAL}
        completedSteps={COMPLETED_STEPS.AT_CONTENT}
      />

      {/* Tabs */}
      {effectiveTabs.length > 1 && (
        <div className="bg-white border-b border-border">
          <div className="flex">
            {effectiveTabs.map(tabId => {
              const config = tabConfig[tabId as keyof typeof tabConfig]
              if (!config) return null

              const Icon = config.icon
              const isActive = activeTab === tabId

              return (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-medium text-sm transition-colors border-b-2 ${
                    isActive
                      ? 'text-secondary border-secondary'
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  <Icon className="size-4" />
                  {config.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Texto/Áudio Tab - Combined */}
        {activeTab === 'texto-audio' && (
          <div className="space-y-6">
            {/* Texto Section */}
            {selectedChannels.includes('texto') && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-foreground">
                      Conte o que aconteceu
                    </h2>
                    <button
                      onClick={() =>
                        speak(
                          'Conte o que aconteceu. Descreva sua manifestação com o máximo de detalhes possível'
                        )
                      }
                      className="size-5 rounded-full bg-secondary hover:bg-secondary-hover flex items-center justify-center transition-colors flex-shrink-0"
                      aria-label="Ouvir instruções"
                    >
                      <RiVolumeUpLine className="size-3 text-white" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Descreva sua manifestação com o máximo de detalhes possível
                  </p>
                </div>

                <div>
                  <label htmlFor="manifestation-text" className="sr-only">
                    Descrição da manifestação
                  </label>
                  <textarea
                    id="manifestation-text"
                    value={textContent}
                    onChange={handleTextChange}
                    placeholder="Descreva sua manifestação aqui..."
                    aria-describedby="char-feedback"
                    className="w-full min-h-textarea p-4 border card-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  <div className="flex items-center justify-between mt-2 text-xs" id="char-feedback">
                    <span
                      className={
                        charCount < minChars
                          ? 'text-destructive'
                          : 'text-muted-foreground'
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

                {/* Tips */}
                <div className="bg-accent rounded-lg p-4">
                  <h3 className="font-semibold text-accent-foreground text-sm mb-2">
                    <span aria-hidden="true">💡</span> Escreva todos os detalhes:
                  </h3>
                  <ul className="text-xs text-accent-foreground space-y-1 ml-4 list-disc">
                    <li>
                      <strong>O que</strong> você precisa ou ocorreu?
                    </li>
                    <li>
                      <strong>Quem</strong> são as pessoas envolvidas (nomes,
                      apelidos)?
                    </li>
                    <li>
                      <strong>Quando</strong> ocorreu (data, horário,
                      frequência)?
                    </li>
                    <li>
                      <strong>Onde</strong> aconteceu (endereço, pontos de
                      referência)?
                    </li>
                    <li>
                      <strong>Como</strong> ocorreu (você presenciou ou foram
                      terceiros)?
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Divider if both are present */}
            {selectedChannels.includes('texto') &&
              selectedChannels.includes('audio') && (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-background text-muted-foreground">
                      OU
                    </span>
                  </div>
                </div>
              )}

            {/* Áudio Section */}
            {selectedChannels.includes('audio') && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Gravar áudio
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Grave até {maxAudios} áudios de 5 minutos cada
                  </p>
                </div>

                {/* Recording Interface */}
                {audioBlobs.length < maxAudios && (
                  <div className="bg-card border card-border rounded-lg p-6">
                    <div className="flex flex-col items-center gap-4">
                      <RiMicLine
                        className={`w-20 h-20 ${isRecording ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`}
                      />

                      {isRecording && (
                        <div className="text-2xl font-bold text-foreground">
                          {formatTime(recordingTime)}
                        </div>
                      )}

                      <div className="flex gap-2">
                        {!isRecording ? (
                          <button
                            onClick={startRecording}
                            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors flex items-center gap-2"
                          >
                            <RiMicLine className="size-5" />
                            {audioBlobs.length === 0
                              ? 'Iniciar Gravação'
                              : 'Gravar Novo Áudio'}
                          </button>
                        ) : (
                          <>
                            {isPaused ? (
                              <button
                                onClick={resumeRecording}
                                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors flex items-center gap-2"
                              >
                                <RiPlayCircleLine className="size-5" />
                                Continuar
                              </button>
                            ) : (
                              <button
                                onClick={pauseRecording}
                                className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2"
                              >
                                <RiPauseCircleLine className="size-5" />
                                Pausar
                              </button>
                            )}
                            <button
                              onClick={stopRecording}
                              className="px-6 py-3 bg-destructive text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                              <RiStopCircleLine className="size-5" />
                              Finalizar
                            </button>
                          </>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {isRecording
                          ? 'Gravando... Clique em Finalizar quando terminar'
                          : audioBlobs.length > 0
                            ? `${audioBlobs.length} de ${maxAudios} áudios gravados`
                            : 'Clique no botão acima para iniciar a gravação'}
                      </p>
                    </div>
                  </div>
                )}

                {/* List of recorded audios */}
                {audioBlobs.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">
                      Áudios gravados ({audioBlobs.length}/{maxAudios})
                    </p>

                    {audioBlobs.map((blob, index) => (
                      <div
                        key={index}
                        className="bg-success/10 border-2 border-success/20 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                              <RiMicLine className="size-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground text-sm">
                                Áudio {index + 1}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteAudio(index)}
                            className="size-8 rounded-full flex items-center justify-center hover:bg-destructive/10 transition-colors"
                          >
                            <RiCloseLine className="size-5 text-destructive" />
                          </button>
                        </div>

                        <audio
                          controls
                          className="w-full"
                          src={URL.createObjectURL(blob)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Arquivos Tab */}
        {activeTab === 'arquivos' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Adicionar arquivos
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Envie documentos, imagens, áudios ou vídeos (até {maxFiles}{' '}
                arquivos)
              </p>
            </div>

            {/* Upload area */}
            <label className="block">
              <div className="bg-card border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-accent transition-colors">
                <RiFileAddLine className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm font-semibold text-foreground mb-1">
                  Clique para selecionar arquivos
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  ou arraste e solte aqui
                </p>
                <p className="text-xs text-muted-foreground">
                  Formatos aceitos: PDF, DOCX, XLSX, PNG, JPG, JPEG, MP3, MP4
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

            {/* Files list */}
            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  Arquivos selecionados ({files.length}/{maxFiles})
                </p>

                {files.map((file, index) => (
                  <div
                    key={index}
                    className="bg-card border card-border rounded-lg p-3 flex items-center gap-3"
                  >
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-accent rounded flex items-center justify-center text-2xl">
                        {getFileIcon(file)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFile(index)}
                      className="size-8 rounded-full flex items-center justify-center hover:bg-destructive/10 transition-colors flex-shrink-0"
                    >
                      <RiCloseLine className="size-5 text-destructive" />
                    </button>
                  </div>
                ))}
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
        showAnonymousInfo={false}
        steps={getStepProgress(STEPS.CONTENT)}
      />
    </div>
  )
}

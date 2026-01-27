'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  RiTextWrap,
  RiMicLine,
  RiImageAddLine,
  RiCheckLine,
  RiVolumeUpLine,
  RiArrowRightLine,
} from 'react-icons/ri'
import { AccessibleHeader } from '@/features/manifestation/components/AccessibleHeader'
import { NavigationFooter } from '@/features/manifestation/components/NavigationFooter'
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { Button } from '@/shared/components/Button'
import { Stepper, getDesktopSteps } from '@/shared/components/Stepper'
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

const channels = [
  {
    id: 'texto',
    label: 'Prefiro escrever',
    description: 'Vou escrever minha manifestação',
    icon: RiTextWrap,
  },
  {
    id: 'audio',
    label: 'Prefiro falar',
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

export default function ChannelSelectionPage() {
  const router = useRouter()
  const { speak } = useTextToSpeech()
  const { navigateToStep } = useStepNavigation()
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('manifestation_channels')
    if (saved) {
      setSelectedChannels(JSON.parse(saved))
    }
  }, [])

  const toggleChannel = (channelId: string) => {
    const channelData =
      AUDIO_TEXTS.channel[channelId as keyof typeof AUDIO_TEXTS.channel]

    // Read the option text
    speak(getAudioText(channelData))

    setSelectedChannels(prev => {
      if (prev.includes(channelId)) {
        return prev.filter(id => id !== channelId)
      } else {
        return [...prev, channelId]
      }
    })
  }

  const handleNext = () => {
    localStorage.setItem(
      'manifestation_channels',
      JSON.stringify(selectedChannels)
    )
    router.push('/manifestacao/conteudo')
  }

  const handleBack = () => {
    router.push('/manifestacao/assunto')
  }

  return (
    <>
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Container */}
      <div className="lg:hidden min-h-screen bg-background pb-40">
        {/* Header */}
        <AccessibleHeader
          currentStep={STEPS.CHANNEL}
          totalSteps={STEPS.TOTAL}
          completedSteps={COMPLETED_STEPS.AT_CHANNEL}
        />

        {/* Main Content */}
        <main className="px-4 py-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold text-foreground">
                Como você prefere contar?
              </h2>
              <button
                onClick={() =>
                  speak(
                    'Como você prefere contar? Escolha uma ou mais formas para se expressar da maneira mais confortável'
                  )
                }
                className="size-5 rounded-full bg-secondary hover:bg-secondary-hover flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Ouvir instruções"
              >
                <RiVolumeUpLine className="size-3 text-white" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Escolha{' '}
              <strong className="text-foreground">uma ou mais formas</strong>{' '}
              para se expressar da maneira mais confortável
            </p>
          </div>

          {/* Channels List */}
          <div className="space-y-3 mb-6">
            {channels.map(channel => {
              const Icon = channel.icon
              const isSelected = selectedChannels.includes(channel.id)

              return (
                <button
                  key={channel.id}
                  onClick={() => toggleChannel(channel.id)}
                  className={`w-full bg-card rounded-lg p-3 card-border text-left flex items-center gap-3 transition-all ${
                    isSelected ? 'ring-2 ring-secondary' : 'hover:bg-accent'
                  }`}
                >
                  <div
                    className={`w-10 h-10 border-2 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-secondary' : 'border-border'
                    }`}
                  >
                    <Icon
                      className={`size-5 ${isSelected ? 'text-secondary' : 'text-muted-foreground'}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-0.5">
                      {channel.label}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {channel.description}
                    </p>
                  </div>
                  <div
                    className={`size-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-success bg-success' : 'border-muted'
                    }`}
                  >
                    {isSelected && (
                      <RiCheckLine className="size-4 text-white" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Selected Summary */}
          {selectedChannels.length > 0 && (
            <div className="bg-success/10 border-2 border-success/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-success font-semibold mb-1">
                ✓ {selectedChannels.length}{' '}
                {selectedChannels.length === 1
                  ? 'formato selecionado'
                  : 'formatos selecionados'}
              </p>
              <p className="text-xs text-foreground">
                {selectedChannels
                  .map(id => channels.find(c => c.id === id)?.label)
                  .join(' + ')}
              </p>
            </div>
          )}
        </main>

        {/* Footer */}
        <NavigationFooter
          currentStep={STEPS.CHANNEL}
          totalSteps={STEPS.TOTAL}
          onBack={handleBack}
          onNext={handleNext}
          onNavigateToStep={navigateToStep}
          nextDisabled={selectedChannels.length === 0}
          showAnonymousInfo={false}
          steps={getStepProgress(STEPS.CHANNEL)}
        />
      </div>

      {/* Desktop Container */}
      <div className="hidden lg:block min-h-screen bg-background">
        <main className="lg:max-w-2xl lg:mx-auto lg:px-8 lg:py-12">
          {/* Progress Steps */}
          <div className="mb-10">
            <Stepper steps={getDesktopSteps(STEPS.CHANNEL)} />
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Nova Manifestação
            </h1>
            <p className="text-muted-foreground">
              Selecione o canal de manifestação desejado.
            </p>
          </div>

          {/* Channels Select */}
          <div className="mb-8">
            <label
              htmlFor="channel"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Canal de manifestação
            </label>
            <Select
              value={selectedChannels[0] || ''}
              onValueChange={value => setSelectedChannels([value])}
            >
              <SelectTrigger id="channel">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {channels.map(channel => (
                  <SelectItem key={channel.id} value={channel.id}>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm">
                        {channel.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {channel.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              Selecione uma opção para continuar
            </p>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button variant="link" onClick={handleBack}>
              Voltar
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedChannels.length === 0}
            >
              Avançar
              <RiArrowRightLine className="size-5" />
            </Button>
          </div>
        </main>
      </div>
    </>
  )
}

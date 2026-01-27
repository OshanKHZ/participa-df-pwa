'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RiEyeOffLine, RiUserLine, RiVolumeUpLine } from 'react-icons/ri'
import { AccessibleHeader } from '@/features/manifestation/components/AccessibleHeader'
import { NavigationFooter } from '@/features/manifestation/components/NavigationFooter'
import { getStepProgress } from '@/shared/utils/stepProgress'
import { useStepNavigation } from '@/shared/hooks/useStepNavigation'
import { TOGGLE, STEPS, COMPLETED_STEPS } from '@/shared/constants/designTokens'

export default function PersonalDataPage() {
  const router = useRouter()
  const { navigateToStep } = useStepNavigation()
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    const savedAnonymous = localStorage.getItem('manifestation_anonymous')
    const savedData = localStorage.getItem('manifestation_personal_data')

    if (savedAnonymous !== null) {
      setIsAnonymous(savedAnonymous === 'true')
    }

    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    localStorage.setItem('manifestation_anonymous', isAnonymous.toString())
    if (!isAnonymous) {
      localStorage.setItem(
        'manifestation_personal_data',
        JSON.stringify(formData)
      )
    } else {
      localStorage.removeItem('manifestation_personal_data')
    }
    router.push('/manifestacao/revisar')
  }

  const handleBack = () => {
    router.push('/manifestacao/conteudo')
  }

  const canProceed = isAnonymous || formData.name.trim() !== ''

  return (
    <div className="min-h-screen bg-background pb-40">
      {/* Header */}
      <AccessibleHeader
        currentStep={STEPS.CONTENT}
        totalSteps={STEPS.TOTAL}
        completedSteps={COMPLETED_STEPS.AT_CONTENT}
      />

      {/* Main Content */}
      <main className="px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-bold text-foreground">
              Identificação (opcional)
            </h2>
            <button
              type="button"
              onClick={() => {
                if (
                  typeof window !== 'undefined' &&
                  'speechSynthesis' in window
                ) {
                  window.speechSynthesis.cancel()
                  const utterance = new SpeechSynthesisUtterance(
                    'Identificação opcional. Você pode se identificar ou manter o anonimato'
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
            Você pode se identificar ou manter o anonimato
          </p>
        </div>

        {/* Anonymous Toggle */}
        <div className="bg-card rounded-lg p-4 card-border mb-6">
          <div className="flex items-start gap-3">
            <div
              className={`w-12 h-12 ${isAnonymous ? 'bg-[var(--color-progress)]' : 'bg-[var(--color-type-sugestao)]'} rounded-lg flex items-center justify-center flex-shrink-0`}
            >
              {isAnonymous ? (
                <RiEyeOffLine className="size-6 text-white" />
              ) : (
                <RiUserLine className="size-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-foreground">
                  Manifestação Anônima
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  role="switch"
                  aria-checked={isAnonymous}
                  aria-label={
                    isAnonymous ? 'Desativar anonimato' : 'Ativar anonimato'
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 ${
                    isAnonymous ? 'bg-secondary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isAnonymous ? TOGGLE.TRANSITION_ON : TOGGLE.TRANSITION_OFF
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {isAnonymous
                  ? 'Sua identidade será mantida em sigilo'
                  : 'Seus dados pessoais serão incluídos'}
              </p>
            </div>
          </div>
        </div>

        {/* Personal Data Form */}
        {!isAnonymous && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="manifestation-name"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Nome completo <span className="text-destructive">*</span>
              </label>
              <input
                id="manifestation-name"
                type="text"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="Digite seu nome"
                autoComplete="name"
                className="w-full p-3 border card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div>
              <label
                htmlFor="manifestation-email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email (opcional)
              </label>
              <input
                id="manifestation-email"
                type="email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
                className="w-full p-3 border card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Receberá atualizações sobre sua manifestação
              </p>
            </div>

            <div>
              <label
                htmlFor="manifestation-phone"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Telefone (opcional)
              </label>
              <input
                id="manifestation-phone"
                type="tel"
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                placeholder="(00) 00000-0000"
                autoComplete="tel"
                className="w-full p-3 border card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 bg-accent rounded-lg p-4">
          <p className="text-xs text-accent-foreground">
            <strong>🔒 Privacidade:</strong> Seus dados são protegidos conforme
            a LGPD e só serão usados para o atendimento da sua manifestação.
          </p>
        </div>
      </main>

      {/* Footer */}
      <NavigationFooter
        currentStep={STEPS.CONTENT}
        totalSteps={STEPS.TOTAL}
        onBack={handleBack}
        onNext={handleNext}
        onNavigateToStep={navigateToStep}
        nextDisabled={!canProceed}
        showAnonymousInfo={true}
        steps={getStepProgress(STEPS.CONTENT)}
      />
    </div>
  )
}

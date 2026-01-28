'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RiEye2Line, RiEyeCloseLine, RiVolumeUpLine } from 'react-icons/ri'
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
        <div className="bg-card rounded-sm p-4 card-border mb-6">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            {isAnonymous ? (
              <RiEyeCloseLine className="size-6 text-secondary flex-shrink-0" />
            ) : (
              <RiEye2Line className="size-6 text-secondary flex-shrink-0" />
            )}
            <div>
              <h3 className="font-semibold text-foreground">
                Manifestação Anônima
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isAnonymous
                  ? 'Sua identidade será mantida em sigilo'
                  : 'Seus dados pessoais serão incluídos'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              role="switch"
              aria-checked={isAnonymous}
              aria-label={
                isAnonymous ? 'Desativar anonimato' : 'Ativar anonimato'
              }
              className={`relative flex-shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 ${
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
        </div>

        {/* Anonymous Legal Info */}
        {isAnonymous && (
          <div className="bg-accent rounded-lg p-4 mb-6">
            <p className="text-xs text-accent-foreground leading-relaxed">
              Solicito que minha identidade seja preservada neste pedido, em atendimento ao princípio constitucional da impessoalidade e, ainda, conforme o disposto no art. 11, § 7º da Lei Distrital nº 6.519/2020.
            </p>
            <p className="text-xs text-accent-foreground leading-relaxed mt-2">
              Estou ciente de que, com a identidade preservada, somente a Controladoria-Geral do Distrito Federal terá acesso aos meus dados pessoais, ressalvadas as exceções previstas nos parágrafos 3º e 4º, do art. 33 da Lei Distrital nº 4.990/2012.
            </p>
            <p className="text-xs text-accent-foreground leading-relaxed mt-2">
              Estou ciente, também, de que o órgão destinatário não poderá solicitar esclarecimentos adicionais, assim como não poderá atender a pedidos de informação pessoal, uma vez que não terá como confirmar minha identidade.
            </p>
          </div>
        )}

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
        <div className="mt-6 bg-primary rounded-sm p-4">
          <p className="text-xs text-white">
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
        steps={getStepProgress(STEPS.CONTENT)}
      />
    </div>
  )
}

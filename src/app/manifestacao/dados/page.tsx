'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RiArrowRightLine } from 'react-icons/ri'
import { AccessibleHeader } from '@/features/manifestation/components/AccessibleHeader'
import { NavigationFooter } from '@/features/manifestation/components/NavigationFooter'
import { IdentificationSection } from '@/features/manifestation/components/IdentificationSection'
import { FormSidebar } from '@/features/manifestation/components/FormSidebar'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { Button } from '@/shared/components/Button'
import { ManifestationHeader } from '@/shared/components/Stepper'
import { getStepProgress } from '@/shared/utils/stepProgress'
import { useStepNavigation } from '@/shared/hooks/useStepNavigation'
import { STEPS, COMPLETED_STEPS } from '@/shared/constants/designTokens'

export default function PersonalDataPage() {
  const router = useRouter()
  const { navigateToStep } = useStepNavigation()
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [anonymousConsent, setAnonymousConsent] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const [steps, setSteps] = useState(getStepProgress(STEPS.DATA, true))

  useEffect(() => {
    setSteps(getStepProgress(STEPS.DATA))
  }, []) // Update on mount to check localStorage

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

  const proceedToNextStep = () => {
    localStorage.setItem('manifestation_anonymous', isAnonymous.toString())
    if (!isAnonymous && formData.name) {
      localStorage.setItem(
        'manifestation_personal_data',
        JSON.stringify(formData)
      )
    } else {
      localStorage.removeItem('manifestation_personal_data')
    }
    router.push('/manifestacao/revisar')
  }

  const handleNext = () => {
    // Se anônimo, mostrar confirmação. Se não, prosseguir direto
    if (isAnonymous && anonymousConsent) {
      setShowConfirmDialog(true)
    } else if (!isAnonymous && formData.name.trim() !== '') {
      proceedToNextStep()
    }
  }

  const handleConfirmAnonymous = () => {
    setShowConfirmDialog(false)
    proceedToNextStep()
  }

  const handleBack = () => {
    router.push('/manifestacao/conteudo')
  }

  const canProceed = isAnonymous
    ? anonymousConsent // Se anônimo, precisa do checkbox
    : formData.name.trim() !== '' // Se identificado, precisa do nome

  return (
    <>
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Container */}
      <div className="lg:hidden min-h-screen bg-background pb-40">
        {/* Header */}
        <AccessibleHeader
          currentStep={STEPS.DATA}
          totalSteps={STEPS.TOTAL}
          completedSteps={COMPLETED_STEPS.AT_DATA}
        />

        {/* Main Content */}
        <main id="main-content" className="px-4 py-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-foreground">
              Identificação (opcional)
            </h1>
            <p className="text-sm text-muted-foreground">
              Você pode se identificar ou manter o anonimato
            </p>
          </div>

          {/* Identification Section */}
          <IdentificationSection
            isAnonymous={isAnonymous}
            onAnonymousChange={setIsAnonymous}
            onFormDataChange={setFormData}
            onAnonymousConsentChange={setAnonymousConsent}
          />

          {/* Info Box */}
          <div className="mt-6">
            <p className="text-xs text-muted-foreground">
              *Base legal Art.14 da{' '}
              <a
                href="http://www.sinj.df.gov.br/sinj/Norma/c87d4625386745569ef03028e6c79397/Instru_o_Normativa_1_05_05_2017.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Instrução Normativa CGDF Nº 01 de 05/05/2017
              </a>
            </p>
          </div>
        </main>

        {/* Footer */}
        <NavigationFooter
          currentStep={STEPS.DATA}
          totalSteps={STEPS.TOTAL}
          onBack={handleBack}
          onNext={handleNext}
          onNavigateToStep={navigateToStep}
          nextDisabled={!canProceed}
          steps={steps}
        />
      </div>

      {/* Desktop Container */}
      <div className="hidden lg:block min-h-screen bg-background">
        <div className="grid grid-cols-[1fr_600px_1fr] gap-12 py-12 px-8">
          {/* Coluna Esquerda - Sidebar */}
          <div className="flex justify-end">
            <FormSidebar
              helpText="Você pode se identificar ou manter sua manifestação anônima. A identificação ajuda no contato para informações adicionais sobre sua solicitação."
            />
          </div>

          {/* Coluna Central - Main Content (sempre centralizado) */}
          <main id="main-content" className="w-full">
          <ManifestationHeader
            currentStep={STEPS.DATA}
            totalSteps={STEPS.TOTAL}
            description="Identificação opcional - você pode se identificar ou manter o anonimato."
            onStepClick={navigateToStep}
          />

          {/* Identification Section */}
          <IdentificationSection
            isAnonymous={isAnonymous}
            onAnonymousChange={setIsAnonymous}
            onFormDataChange={setFormData}
            onAnonymousConsentChange={setAnonymousConsent}
          />

          {/* Info Box */}
          <div className="mt-6">
            <p className="text-xs text-muted-foreground">
              *Base legal Art.14 da{' '}
              <a
                href="http://www.sinj.df.gov.br/sinj/Norma/c87d4625386745569ef03028e6c79397/Instru_o_Normativa_1_05_05_2017.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Instrução Normativa CGDF Nº 01 de 05/05/2017
              </a>
            </p>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
            <Button variant="link" onClick={handleBack}>
              Voltar
            </Button>
            <Button onClick={handleNext} disabled={!canProceed}>
              {isAnonymous ? 'Continuar' : 'Avançar'}
              <RiArrowRightLine className="size-5" />
            </Button>
          </div>
          </main>

          {/* Coluna Direita - Vazia (para manter centralização) */}
          <div />
        </div>
      </div>

      {/* Anonymous Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmAnonymous}
        title="Confirmar manifestação anônima"
        message={
          <>
            <p>
              Recomendamos que se identifique fazendo login ou cadastro. Seus
              dados estarão seguros e você poderá acompanhar o andamento.
            </p>
            <p className="mt-3">
              <strong>
                Caso opte pelo anonimato, acompanhe apenas através do protocolo
                gerado no envio.
              </strong>
            </p>
            <p className="mt-3 text-xs">
              ⚠️ Lembre-se de copiar o protocolo após o envio, pois ele será sua
              única forma de consulta.
            </p>
          </>
        }
        confirmText="Continuar Anônimo"
        cancelText="Voltar"
      />
    </>
  )
}

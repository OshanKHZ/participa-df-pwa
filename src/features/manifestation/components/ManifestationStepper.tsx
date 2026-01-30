import { Stepper, type StepperStep } from '@/shared/components/Stepper'

// Helper para gerar steps para desktop baseado no step atual
// Usa labels mais curtos para caber melhor no layout
export function getDesktopSteps(currentStep: number): StepperStep[] {
  const labels = ['Tipo', 'Identidade', 'Assunto', 'Conteúdo', 'Confirmação']

  return labels.map((label, index) => {
    const stepNumber = index + 1
    return {
      number: stepNumber,
      label,
      completed: stepNumber < currentStep,
      current: stepNumber === currentStep,
    }
  })
}

// Helper para obter o label do passo atual
export function getStepLabel(stepNumber: number): string {
  const labels: Record<number, string> = {
    1: 'Tipo',
    2: 'Identidade',
    3: 'Assunto',
    4: 'Conteúdo',
    5: 'Confirmação',
  }
  return labels[stepNumber] || ''
}

// Componente para cabeçalho de página de manifestação
export interface ManifestationHeaderProps {
  currentStep: number
  totalSteps: number
  description: string
  title?: string
  onStepClick?: (stepNumber: number) => void
}

export function ManifestationHeader({
  currentStep,
  totalSteps,
  description,
  title = 'Nova Manifestação',
  onStepClick,
}: ManifestationHeaderProps) {
  return (
    <>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
      </div>

      {/* Progress Steps */}
      <div className="mb-6">
        <Stepper
          steps={getDesktopSteps(currentStep)}
          onStepClick={onStepClick}
        />
      </div>

      {/* Step Progress Info */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Passo {currentStep}/{totalSteps} - {getStepLabel(currentStep)}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </>
  )
}

'use client'

import type { ReactNode } from 'react'
import React, { Children } from 'react'

export interface StepperStep {
  number: number
  label: string
  completed: boolean
  current?: boolean
}

export interface StepperProps {
  steps: StepperStep[]
}

export function Stepper({ steps }: StepperProps) {
  return (
    <div className="flex items-center justify-between w-full gap-2">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <span
              className={`text-xs font-medium mb-2 ${
                step.current ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {step.label}
            </span>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 ${
                step.current
                  ? 'bg-secondary border-secondary text-white'
                  : step.completed
                    ? 'bg-success border-success text-white'
                    : 'bg-card border-border text-muted-foreground'
              }`}
            >
              {step.completed && !step.current ? '✓' : step.number}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mt-5 ${
                step.completed ? 'bg-success' : 'bg-border'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// Formato alternativo horizontal mais compacto
export interface StepperCompactProps {
  steps: StepperStep[]
  className?: string
}

export function StepperCompact({ steps, className = '' }: StepperCompactProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${
              step.current
                ? 'bg-secondary border-secondary text-white'
                : step.completed
                  ? 'bg-success border-success text-white'
                  : 'bg-card border-border text-muted-foreground'
            }`}
          >
            {step.completed && !step.current ? '✓' : step.number}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 w-8 ${
                step.completed ? 'bg-success' : 'bg-border'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// Wrapper para usar com children (estilo do componente original)
export interface StepperWrapperProps {
  children: ReactNode
  currentStep: number
  onStepChange?: (step: number) => void
  className?: string
  stepContainerClassName?: string
  contentClassName?: string
  footerClassName?: string
  backButtonText?: string
  nextButtonText?: string
  completeButtonText?: string
  onBack?: () => void
  onNext?: () => void
  onComplete?: () => void
  disableStepIndicators?: boolean
  renderStepIndicator?: (props: {
    step: number
    currentStep: number
    onStepClick: (step: number) => void
  }) => ReactNode
}

export function StepperWrapper({
  children,
  currentStep,
  onStepChange,
  className = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonText = 'Voltar',
  nextButtonText = 'Continuar',
  completeButtonText = 'Concluir',
  onBack,
  onNext,
  onComplete,
  disableStepIndicators = false,
  renderStepIndicator,
}: StepperWrapperProps) {
  const stepsArray = Children.toArray(children)
  const totalSteps = stepsArray.length
  const isLastStep = currentStep === totalSteps

  const handleStepClick = (step: number) => {
    if (!disableStepIndicators && step !== currentStep && onStepChange) {
      onStepChange(step)
    }
  }

  const handleBack = () => {
    if (onBack) onBack()
    else if (onStepChange && currentStep > 1) onStepChange(currentStep - 1)
  }

  const handleNext = () => {
    if (onNext) onNext()
    else if (onStepChange && !isLastStep) onStepChange(currentStep + 1)
  }

  const handleComplete = () => {
    if (onComplete) onComplete()
  }

  return (
    <div className={className}>
      {/* Step Indicators */}
      <div
        className={`${stepContainerClassName} flex w-full items-center justify-center p-8`}
      >
        {stepsArray.map((_, index) => {
          const stepNumber = index + 1
          const isNotLastStep = index < totalSteps - 1
          const isCompleted = stepNumber < currentStep
          const isCurrentStep = stepNumber === currentStep

          return (
            <div key={stepNumber} className="flex flex-col items-center flex-1">
              {renderStepIndicator ? (
                renderStepIndicator({
                  step: stepNumber,
                  currentStep,
                  onStepClick: handleStepClick,
                })
              ) : (
                <button
                  onClick={() => handleStepClick(stepNumber)}
                  disabled={disableStepIndicators}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 ${
                    isCurrentStep
                      ? 'bg-secondary border-secondary text-white'
                      : isCompleted
                        ? 'bg-success border-success text-white'
                        : 'bg-card border-border text-muted-foreground'
                  } ${disableStepIndicators ? 'cursor-default' : 'cursor-pointer'}`}
                  aria-label={`Ir para passo ${stepNumber}`}
                  aria-current={isCurrentStep ? 'step' : undefined}
                >
                  {isCompleted && !isCurrentStep ? '✓' : stepNumber}
                </button>
              )}
              {isNotLastStep && (
                <div
                  className={`flex-1 h-0.5 -mt-5 mx-2 self-start translate-x-1/2 ${
                    isCompleted ? 'bg-success' : 'bg-border'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <div className={`${contentClassName} px-8`}>
        {stepsArray[currentStep - 1]}
      </div>

      {/* Footer Navigation */}
      <div className={`${footerClassName} px-8 pb-8`}>
        <div
          className={`mt-10 flex ${currentStep !== 1 ? 'justify-between' : 'justify-end'}`}
        >
          {currentStep !== 1 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors rounded"
            >
              {backButtonText}
            </button>
          )}
          <button
            onClick={isLastStep ? handleComplete : handleNext}
            className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors font-medium"
          >
            {isLastStep ? completeButtonText : nextButtonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export interface StepProps {
  children: ReactNode
}

export function Step({ children }: StepProps) {
  return <div>{children}</div>
}

// Helper para gerar steps para desktop baseado no step atual
// Usa labels mais curtos para caber melhor no layout
export function getDesktopSteps(currentStep: number): StepperStep[] {
  const labels = ['Tipo', 'Assunto', 'Conteúdo', 'Confirmação']

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

'use client'

import { useState } from 'react'
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiGridLine,
  RiShieldCheckLine,
  RiCheckLine,
  RiCloseLine,
} from 'react-icons/ri'
import type { Step } from '@/shared/utils/stepProgress'
import { DEFAULT_STEPS } from '@/shared/utils/stepProgress'

interface NavigationFooterProps {
  currentStep: number
  totalSteps: number
  onBack?: () => void
  onNext?: () => void
  onNavigateToStep?: (step: number) => void
  nextDisabled?: boolean
  showAnonymousInfo?: boolean
  steps?: Step[]
}

export function NavigationFooter({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onNavigateToStep,
  nextDisabled = false,
  showAnonymousInfo = true,
  steps = DEFAULT_STEPS,
}: NavigationFooterProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleStepClick = (stepNumber: number) => {
    const step = steps.find(s => s.number === stepNumber)
    // Allow navigation to current step, completed steps, and previous steps
    const canNavigate = step && (step.completed || stepNumber <= currentStep)
    if (canNavigate && onNavigateToStep) {
      onNavigateToStep(stepNumber)
      setDrawerOpen(false)
    }
  }

  return (
    <>
      {/* Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-dropdown"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-border z-drawer transition-transform duration-300 ${
          drawerOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '70vh' }}
      >
        <div className="px-4 py-4">
          {/* Drawer Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">
              Navegação de passos
            </h3>
            <button
              onClick={() => setDrawerOpen(false)}
              className="size-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <RiCloseLine className="size-6 text-foreground" />
            </button>
          </div>

          {/* Steps List */}
          <div className="space-y-2 mb-4">
            {steps.map(step => {
              const isCurrent = step.number === currentStep
              // Can navigate to current, completed, or previous steps
              const canNavigate = step.completed || step.number <= currentStep

              return (
                <button
                  key={step.number}
                  onClick={() => handleStepClick(step.number)}
                  disabled={!canNavigate}
                  className={`w-full p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                    isCurrent
                      ? 'border-secondary bg-secondary/10'
                      : canNavigate
                        ? 'border-border hover:bg-accent cursor-pointer'
                        : 'border-border bg-muted/50 cursor-not-allowed opacity-60'
                  }`}
                >
                  {/* Step indicator */}
                  <div
                    className={`size-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      step.completed
                        ? 'border-success bg-success'
                        : isCurrent
                          ? 'border-secondary bg-secondary'
                          : 'border-muted bg-transparent'
                    }`}
                  >
                    {step.completed ? (
                      <RiCheckLine className="size-4 text-white" />
                    ) : (
                      <span
                        className={`text-xs font-semibold ${isCurrent ? 'text-white' : 'text-muted-foreground'}`}
                      >
                        {step.number}
                      </span>
                    )}
                  </div>

                  {/* Step label */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold leading-snug ${isCurrent ? 'text-secondary' : 'text-foreground'}`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.completed
                        ? 'Concluído'
                        : isCurrent
                          ? 'Em andamento'
                          : 'Pendente'}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-header">
        <div className="px-4 py-4">
          {/* Navigation buttons */}
          <div className="flex items-center gap-2 mb-3">
            {/* Back button */}
            <button
              onClick={onBack}
              disabled={!onBack}
              className={`flex-1 py-3.5 px-4 rounded border-2 border-border font-medium transition-colors ${
                !onBack
                  ? 'text-muted-foreground cursor-not-allowed'
                  : 'text-foreground hover:bg-accent'
              }`}
              aria-label="Voltar"
            >
              <div className="flex items-center justify-center gap-2">
                <RiArrowLeftLine className="size-5" />
                <span className="text-sm font-semibold">Voltar</span>
              </div>
            </button>

            {/* Show steps drawer button */}
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="flex-1 py-3.5 px-4 rounded border-2 border-border font-medium text-foreground hover:bg-accent transition-colors"
              aria-label="Ver todos os passos"
            >
              <div className="flex items-center justify-center gap-2">
                <RiGridLine className="size-5" />
                <span className="text-sm font-semibold">
                  {currentStep}/{totalSteps}
                </span>
              </div>
            </button>

            {/* Next button */}
            <button
              onClick={onNext}
              disabled={nextDisabled || !onNext}
              className={`flex-1 py-3.5 px-4 rounded font-medium transition-colors ${
                nextDisabled || !onNext
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-success text-white hover:opacity-90'
              }`}
              aria-label="Avançar"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-semibold">Avançar</span>
                <RiArrowRightLine className="size-5" />
              </div>
            </button>
          </div>

          {/* Anonymous info */}
          {showAnonymousInfo && (
            <div className="bg-accent rounded-lg p-3 flex items-start gap-2">
              <RiShieldCheckLine className="size-5 text-secondary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-accent-foreground mb-0.5">
                  Manifestação Confidencial
                </p>
                <p className="text-xs text-muted-foreground">
                  Você pode escolher se identificar ou manter o anonimato
                </p>
              </div>
            </div>
          )}
        </div>
      </footer>
    </>
  )
}

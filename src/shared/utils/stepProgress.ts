import { STORAGE_KEYS } from '@/shared/constants/storageKeys'
import { STEPS } from '@/shared/constants/designTokens'

export interface Step {
  number: number
  label: string
  completed: boolean
}

export const DEFAULT_STEPS: Step[] = [
  { number: STEPS.TYPE, label: 'Tipo de manifestação', completed: false },
  { number: STEPS.SUBJECT, label: 'Assunto', completed: false },
  { number: STEPS.CHANNEL, label: 'Como prefere contar', completed: false },
  { number: STEPS.CONTENT, label: 'Sua manifestação', completed: false },
  { number: STEPS.REVIEW, label: 'Revisão final', completed: false },
]

/**
 * Get step progress based on current manifestation data
 */
export function getStepProgress(currentStep: number): Step[] {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    // Return steps without checking localStorage during SSR
    return DEFAULT_STEPS.map(step => ({
      ...step,
      completed: step.number < currentStep,
    }))
  }

  // Check localStorage for saved data
  const manifestationType = localStorage.getItem(STORAGE_KEYS.type)
  const manifestationSubject = localStorage.getItem(STORAGE_KEYS.subjectId)
  const manifestationChannel = localStorage.getItem(STORAGE_KEYS.channels)
  const manifestationContent = localStorage.getItem(STORAGE_KEYS.content)

  return DEFAULT_STEPS.map(step => ({
    ...step,
    completed:
      (step.number === STEPS.TYPE && !!manifestationType) ||
      (step.number === STEPS.SUBJECT && !!manifestationSubject) ||
      (step.number === STEPS.CHANNEL && !!manifestationChannel) ||
      (step.number === STEPS.CONTENT && !!manifestationContent) ||
      step.number < currentStep,
  }))
}

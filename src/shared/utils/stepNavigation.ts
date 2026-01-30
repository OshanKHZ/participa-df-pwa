import { STEPS } from '@/shared/constants/designTokens'

/**
 * Maps step numbers to their respective URLs
 */
export function getStepUrl(stepNumber: number): string {
  const stepUrls: Record<number, string> = {
    [STEPS.TYPE]: '/manifestacao',
    [STEPS.IDENTITY]: '/manifestacao/identidade',
    [STEPS.SUBJECT]: '/manifestacao/assunto',
    [STEPS.CONTENT]: '/manifestacao/conteudo',
    [STEPS.REVIEW]: '/manifestacao/revisar',
  }

  return stepUrls[stepNumber] || '/manifestacao'
}

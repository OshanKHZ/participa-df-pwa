import { useRouter } from 'next/navigation'
import { getStepUrl } from '@/shared/utils/stepNavigation'

/**
 * Hook for navigating between manifestation steps
 */
export function useStepNavigation() {
  const router = useRouter()

  const navigateToStep = (stepNumber: number) => {
    router.push(getStepUrl(stepNumber))
  }

  return { navigateToStep }
}

import { useEffect, useCallback } from 'react'

let audioEnabled = false

export function useTextToSpeech() {
  const speak = useCallback((text: string) => {
    if (
      !audioEnabled ||
      typeof window === 'undefined' ||
      !('speechSynthesis' in window)
    ) {
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'pt-BR'
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Speak
    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return
    }
    window.speechSynthesis.cancel()
  }, [])

  const setEnabled = useCallback(
    (enabled: boolean) => {
      audioEnabled = enabled
      if (!enabled) {
        stop()
      }
    },
    [stop]
  )

  const isEnabled = useCallback(() => {
    return audioEnabled
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  return { speak, stop, setEnabled, isEnabled }
}

'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { FONT_LEVELS } from '@/shared/constants/designTokens'

export type SaturationLevel = 'low' | 'normal' | 'high'

export interface AccessibilityPreferences {
  fontSize: number // 0-3 (FONT_LEVELS.MIN to FONT_LEVELS.MAX)
  highContrast: boolean
  monochrome: boolean
  saturation: SaturationLevel
}

interface AccessibilityContextType {
  preferences: AccessibilityPreferences
  setFontSize: (level: number) => void
  toggleHighContrast: () => void
  toggleMonochrome: () => void
  setSaturation: (level: SaturationLevel) => void
  resetAll: () => void
}

const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  fontSize: FONT_LEVELS.MIN,
  highContrast: false,
  monochrome: false,
  saturation: 'normal',
}

const STORAGE_KEY = 'accessibility-preferences'

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(
  undefined
)

const FONT_SIZE_CLASSES = [
  'text-base', // Level 0 (default)
  'text-lg', // Level 1
  'text-xl', // Level 2
  'text-2xl', // Level 3
]

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(DEFAULT_PREFERENCES)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as AccessibilityPreferences
        setPreferences(parsed)
      }
    } catch (error) {
      console.error('Failed to load accessibility preferences:', error)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (!isInitialized) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    } catch (error) {
      console.error('Failed to save accessibility preferences:', error)
    }
  }, [preferences, isInitialized])

  // Apply CSS classes to document based on preferences
  useEffect(() => {
    if (!isInitialized) return

    const root = document.documentElement

    // Font size
    FONT_SIZE_CLASSES.forEach(cls => root.classList.remove(cls))
    const fontClass = (FONT_SIZE_CLASSES[preferences.fontSize] || FONT_SIZE_CLASSES[0]) as string
    root.classList.add(fontClass)

    // High contrast
    if (preferences.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Monochrome
    if (preferences.monochrome) {
      root.classList.add('monochrome')
    } else {
      root.classList.remove('monochrome')
    }

    // Saturation
    root.classList.remove('saturation-low', 'saturation-normal', 'saturation-high')
    root.classList.add(`saturation-${preferences.saturation}`)
  }, [preferences, isInitialized])

  const setFontSize = useCallback((level: number) => {
    const clampedLevel = Math.max(FONT_LEVELS.MIN, Math.min(FONT_LEVELS.MAX, level))
    setPreferences(prev => ({ ...prev, fontSize: clampedLevel }))
  }, [])

  const toggleHighContrast = useCallback(() => {
    setPreferences(prev => ({ ...prev, highContrast: !prev.highContrast }))
  }, [])

  const toggleMonochrome = useCallback(() => {
    setPreferences(prev => ({ ...prev, monochrome: !prev.monochrome }))
  }, [])

  const setSaturation = useCallback((level: SaturationLevel) => {
    setPreferences(prev => ({ ...prev, saturation: level }))
  }, [])

  const resetAll = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES)
  }, [])

  return (
    <AccessibilityContext.Provider
      value={{
        preferences,
        setFontSize,
        toggleHighContrast,
        toggleMonochrome,
        setSaturation,
        resetAll,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { FONT_LEVELS } from '@/shared/constants/designTokens'

interface FontSizeContextType {
  fontSizeLevel: number
  setFontSizeLevel: (level: number) => void
  getFontSizeClass: () => string
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(
  undefined
)

const FONT_SIZE_CLASSES = [
  'text-base', // Level 1 (default)
  'text-lg', // Level 2
  'text-xl', // Level 3
  'text-2xl', // Level 4
]

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSizeLevel, setFontSizeLevel] = useState(FONT_LEVELS.MIN)

  // Apply font size to document root
  useEffect(() => {
    const root = document.documentElement
    // Remove all font size classes
    FONT_SIZE_CLASSES.forEach(cls => {
      root.classList.remove(cls)
    })
    // Add current font size class
    const fontClass = (FONT_SIZE_CLASSES[fontSizeLevel] ||
      FONT_SIZE_CLASSES[0]) as string
    root.classList.add(fontClass)
  }, [fontSizeLevel])

  const getFontSizeClass = (): string =>
    (FONT_SIZE_CLASSES[fontSizeLevel] || FONT_SIZE_CLASSES[0]) as string

  return (
    <FontSizeContext.Provider
      value={{ fontSizeLevel, setFontSizeLevel, getFontSizeClass }}
    >
      {children}
    </FontSizeContext.Provider>
  )
}

export function useFontSize() {
  const context = useContext(FontSizeContext)
  if (!context) {
    throw new Error('useFontSize must be used within FontSizeProvider')
  }
  return context
}

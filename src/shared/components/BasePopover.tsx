'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

interface BasePopoverProps {
  isOpen: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement | null>
  children: ReactNode
  className?: string
}

export function BasePopover({
  isOpen,
  onClose,
  triggerRef,
  children,
  className = 'left-0',
}: BasePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        triggerRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)

      // Focus first item if opened via keyboard (trigger is focused)
      if (document.activeElement === triggerRef.current) {
        const firstFocusable = popoverRef.current?.querySelector(
          'a, button, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement
        setTimeout(() => firstFocusable?.focus(), 50)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, onClose, triggerRef])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const focusableElements = popoverRef.current?.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusableElements) return

    const elements = Array.from(focusableElements) as HTMLElement[]
    if (elements.length === 0) return

    const currentIndex = elements.indexOf(document.activeElement as HTMLElement)

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nextIndex = (currentIndex + 1) % elements.length
      elements[nextIndex]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prevIndex = (currentIndex - 1 + elements.length) % elements.length
      elements[prevIndex]?.focus()
    }
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      onClose()
    }, 100)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (!isOpen) return null

  return (
    <div
      ref={popoverRef}
      className={`absolute top-full mt-0 w-72 bg-primary-light shadow-lg z-popover overflow-hidden outline-none ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role="menu"
      aria-orientation="vertical"
    >
      <div className="divide-y divide-white/10" role="none">
        {children}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { RiCloseLine } from 'react-icons/ri'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string | React.ReactNode
  confirmText?: string
  cancelText?: string
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Continuar',
  cancelText = 'Voltar',
}: ConfirmDialogProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      document.body.style.overflow = 'hidden'
    } else {
      setIsAnimating(false)
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen && !isAnimating) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isOpen ? 'bg-black/40' : 'bg-black/0'
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div
        className={`bg-background rounded-sm shadow-lg max-w-md w-full overflow-hidden transition-all duration-200 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <h2
              id="dialog-title"
              className="text-base font-semibold text-foreground leading-tight pr-8"
            >
              {title}
            </h2>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors rounded-sm p-1 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-1"
              aria-label="Fechar"
            >
              <RiCloseLine className="size-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <div
            id="dialog-description"
            className="text-sm text-muted-foreground leading-relaxed"
          >
            {message}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-muted/10 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-foreground rounded-sm hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-1"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary/90 rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-1"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

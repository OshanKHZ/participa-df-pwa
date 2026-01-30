import { useEffect, useState } from 'react'
import { RiCloseLine } from 'react-icons/ri'
import { useFocusTrap } from '@/shared/hooks/useFocusTrap'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = '',
  size = 'md',
}: ModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useFocusTrap(isOpen)

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
  }

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
    >
      <div
        ref={containerRef}
        className={`bg-background rounded-sm shadow-lg w-full overflow-hidden transition-all duration-200 flex flex-col max-h-[90vh] ${
          sizeClasses[size]
        } ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-98'} ${className}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-start justify-between gap-4 shrink-0">
          {title && (
            <h2 className="text-base font-semibold text-foreground leading-tight pr-8">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors rounded-sm p-1 btn-focus ml-auto"
            aria-label="Fechar"
          >
            <RiCloseLine className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-muted/10 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end shrink-0 border-t border-border/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

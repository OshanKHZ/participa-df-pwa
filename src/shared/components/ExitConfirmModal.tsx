'use client'

import { RiCloseLine, RiSaveLine, RiDeleteBinLine } from 'react-icons/ri'
import { useFocusTrap } from '@/shared/hooks/useFocusTrap'

interface ExitConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveAndExit: () => void
  onExitWithoutSaving: () => void
}

export function ExitConfirmModal({
  isOpen,
  onClose,
  onSaveAndExit,
  onExitWithoutSaving,
}: ExitConfirmModalProps) {
  const containerRef = useFocusTrap(isOpen)

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-modal"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={containerRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-modal modal-width-mobile max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-modal-title"
      >
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2
              id="exit-modal-title"
              className="text-lg font-bold text-foreground"
            >
              Salvar progresso?
            </h2>
            <button
              onClick={onClose}
              className="size-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Fechar modal"
            >
              <RiCloseLine className="size-6 text-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-sm text-foreground mb-2">
              Você preencheu parte da manifestação.
            </p>
            <p className="text-sm text-muted-foreground">
              Deseja salvar seu progresso como rascunho para continuar depois ou
              descartar as alterações?
            </p>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <button
              onClick={onSaveAndExit}
              className="w-full py-3 px-4 bg-success text-white rounded-lg hover:opacity-90 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <RiSaveLine className="size-5" />
              Salvar como rascunho
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 border-2 border-border text-foreground rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2 font-medium"
            >
              Continuar preenchendo
            </button>

            <button
              onClick={onExitWithoutSaving}
              className="w-full py-3 px-4 text-destructive hover:text-destructive/80 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <RiDeleteBinLine className="size-5" />
              Descartar alterações
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

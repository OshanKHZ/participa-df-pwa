import { Button } from './Button'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string | React.ReactNode
  confirmText?: string
  cancelText?: string
  variant?: 'primary' | 'secondary' | 'success' | 'destructive'
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Continuar',
  cancelText = 'Voltar',
  variant = 'secondary',
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      footer={
        <>
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full sm:w-auto rounded-none"
            size="sm"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            className="w-full sm:w-auto rounded-none"
            size="sm"
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="text-sm text-muted-foreground leading-relaxed">
        {message}
      </div>
    </Modal>
  )
}

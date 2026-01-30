import { forwardRef } from 'react'
import { RiArrowRightSLine } from 'react-icons/ri'

export interface ServiceCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  disabled?: boolean
  onClick?: () => void
}

export const ServiceCard = forwardRef<HTMLButtonElement, ServiceCardProps>(
  ({ icon: Icon, title, disabled, onClick }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className="group flex items-center gap-3 p-4 text-left transition-all duration-200 rounded-lg border border-border bg-card hover:bg-accent hover:border-secondary/50 btn-focus focus:ring-inset disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon
          className="text-secondary flex-shrink-0 size-6"
          aria-hidden="true"
        />
        <span className="flex-1 font-medium text-foreground text-sm">
          {title}
        </span>
        {!disabled && (
          <RiArrowRightSLine
            className="text-muted-foreground flex-shrink-0 size-5"
            aria-hidden="true"
          />
        )}
      </button>
    )
  }
)

ServiceCard.displayName = 'ServiceCard'

'use client'

import { forwardRef, type ComponentRef } from 'react'

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'destructive'
  size?: 'sm' | 'default' | 'lg'
}

const Button = forwardRef<ComponentRef<'button'>, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors btn-focus disabled:pointer-events-none disabled:opacity-50 cursor-pointer'

    const variants = {
      primary: 'bg-success text-white hover:opacity-90',
      secondary: 'bg-primary text-white hover:bg-primary/90',
      ghost: 'hover:bg-accent hover:text-foreground',
      link: 'text-secondary underline-offset-4 hover:underline',
      destructive: 'text-destructive underline-offset-4 hover:underline',
    }

    const sizes = {
      sm: 'h-11 px-4 text-sm',
      default: 'h-12 px-6',
      lg: 'h-14 px-8',
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }

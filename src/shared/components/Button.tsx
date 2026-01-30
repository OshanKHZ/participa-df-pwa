'use client'

import { forwardRef, type ComponentRef } from 'react'
import Link from 'next/link'

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'ghost'
    | 'link'
    | 'destructive'
    | 'accent'
  size?: 'sm' | 'default' | 'lg'
}

export interface LinkButtonProps extends React.ComponentPropsWithoutRef<
  typeof Link
> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'ghost'
    | 'link'
    | 'destructive'
    | 'accent'
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
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
      success: 'bg-success text-white hover:opacity-90',
      accent: 'bg-accent text-secondary hover:bg-accent/80',
      ghost: 'hover:bg-accent hover:text-foreground',
      link: 'text-secondary underline-offset-4 hover:underline',
      destructive:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
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

// LinkButton component for Next.js links with button styling
export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    { className, variant = 'primary', size = 'default', children, ...props },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors btn-focus cursor-pointer'

    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
      success: 'bg-success text-white hover:opacity-90',
      accent: 'bg-accent text-secondary hover:bg-accent/80',
      ghost: 'hover:bg-accent hover:text-foreground',
      link: 'text-secondary underline-offset-4 hover:underline',
      destructive:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    }

    const sizes = {
      sm: 'h-11 px-4 text-sm',
      default: 'h-12 px-6',
      lg: 'h-14 px-8',
    }

    return (
      <Link
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
        {...props}
      >
        {children}
      </Link>
    )
  }
)

LinkButton.displayName = 'LinkButton'

export { Button }

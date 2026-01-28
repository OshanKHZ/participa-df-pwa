'use client'

import Image from 'next/image'

interface FormSidebarProps {
  helpText: string
  className?: string
}

export function FormSidebar({ helpText, className = '' }: FormSidebarProps) {
  return (
    <aside className={`hidden lg:block ${className}`}>
      <div className="w-[180px] flex-shrink-0 space-y-4">
        {/* Logo */}
        <div className="w-[240px] -ml-[30px]">
          <Image
            src="/Logo-OUV.svg"
            alt="Logo Ouvidoria do Distrito Federal"
            width={360}
            height={240}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Help Text */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {helpText}
        </p>
      </div>
    </aside>
  )
}

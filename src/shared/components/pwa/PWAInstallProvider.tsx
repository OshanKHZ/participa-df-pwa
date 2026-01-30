'use client'

import { usePWAInstall } from '@/shared/hooks/usePWAInstall'
import { InstallPromptBanner } from './InstallPromptBanner'

export function PWAInstallProvider() {
  const { showPrompt, promptInstall, dismissPrompt, isInstalled } =
    usePWAInstall()

  // Don't render anything if already installed
  if (isInstalled) {
    return null
  }

  return (
    <>
      {showPrompt && (
        <InstallPromptBanner
          onInstall={promptInstall}
          onDismiss={dismissPrompt}
        />
      )}
    </>
  )
}

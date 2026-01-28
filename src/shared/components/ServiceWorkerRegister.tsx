'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      const publicUrl = new URL(
        process.env.NEXT_PUBLIC_BASE_URL || '',
        window.location.href
      )
      const swUrl = `${publicUrl.origin}/sw.js`

      navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
          // console.log('[PWA] Service Worker registered:', registration.scope)

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  // console.log('[PWA] New content available, refresh to update')
                }
              })
            }
          })
        })
        .catch(error => {
          console.error('[PWA] Service Worker registration failed:', error)
        })
    }
  }, [])

  return null
}

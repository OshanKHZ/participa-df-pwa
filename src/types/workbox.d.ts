declare global {
  interface Window {
    workbox: {
      ready: Promise<void>
      register(): void
      messageSW(message: { type: string }): void
      waiting: ServiceWorker | null
      addEventListener: (
        event: string,
        listener: (event: { isUpdate?: boolean }) => void
      ) => void
      removeEventListener: (
        event: string,
        listener: (event: { isUpdate?: boolean }) => void
      ) => void
    }
  }
}

export {}

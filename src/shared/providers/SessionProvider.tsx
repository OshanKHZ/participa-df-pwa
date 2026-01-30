'use client'

import { createContext, useContext } from 'react'

const SessionContext = createContext<{ user: unknown } | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // For now, simpler implementation.
  // In a full implementation, we might fetch session status here or pass it from server.
  return <>{children}</>
}

export const useSession = () => useContext(SessionContext)

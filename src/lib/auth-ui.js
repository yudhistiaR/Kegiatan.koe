'use client'

import { authClient } from '@/lib/auth-client'

export function useAuth() {
  const { data } = authClient.useSession()

  return {
    userId: data?.user?.id || null,
    orgId: data?.session?.activeOrganizationId || null,
    has: () => Boolean(data?.user?.id)
  }
}

export function useUser() {
  const { data, isPending } = authClient.useSession()
  return {
    isLoaded: !isPending,
    user: data?.user || null
  }
}

export function SignedIn({ children }) {
  const { userId } = useAuth()
  if (!userId) return null
  return children
}

export function SignedOut({ children }) {
  const { userId } = useAuth()
  if (userId) return null
  return children
}

export function Protect({ children }) {
  const { userId } = useAuth()
  if (!userId) return null
  return children
}

export function UserButton() {
  return null
}

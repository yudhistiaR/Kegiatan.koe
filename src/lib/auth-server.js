import { headers } from 'next/headers'
import { redirect as nextRedirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function getSessionFromHeaders(headerStore) {
  return auth.api.getSession({ headers: headerStore }).catch(() => null)
}

export async function clerkClient() {
  return createClerkClient()
}

export async function createClerkClient() {
  return {
    users: {
      getUser: async userId => prisma.user.findUnique({ where: { id: userId } }),
      updateUser: async (userId, payload) => ({ id: userId, ...payload }),
      updateUserMetadata: async (userId, payload) => ({ id: userId, ...payload })
    },
    organizations: {
      getOrganization: async ({ organizationId }) =>
        prisma.organisasi.findUnique({ where: { id: organizationId } }),
      getOrganizationMembershipList: async ({ organizationId }) => {
        const data = await prisma.organisasi_member.findMany({
          where: { organisasiId: organizationId }
        })
        return { data }
      }
    }
  }
}

export async function authCompat() {
  const headerStore = await headers()
  const session = await getSessionFromHeaders(headerStore)
  const userId = session?.user?.id || null

  return {
    userId,
    orgId: session?.session?.activeOrganizationId || null,
    sessionClaims: session?.user || {},
    has: () => Boolean(userId),
    redirect: path => nextRedirect(path),
    redirectToSignIn: () => nextRedirect('/sign-in')
  }
}

export { authCompat as auth }

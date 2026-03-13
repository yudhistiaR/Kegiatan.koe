import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { organization } from 'better-auth/plugins'
import { prisma } from '@/lib/prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mysql'
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true
    })
  ],
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL].filter(Boolean)
})

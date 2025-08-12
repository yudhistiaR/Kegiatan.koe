import { NextResponse } from 'next/server'
import { auth, createClerkClient } from '@clerk/nextjs/server'

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
})

export async function GET() {
  const { orgId } = await auth()

  const anggotaOrganisasi =
    await clerk.organizations.getOrganizationMembershipList({
      organizationId: orgId
    })

  return NextResponse.json(anggotaOrganisasi.publickMetaData, { status: 200 })
}

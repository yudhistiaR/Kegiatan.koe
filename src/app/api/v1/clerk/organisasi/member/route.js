import { NextResponse } from 'next/server'
import { auth, createClerkClient } from '@clerk/nextjs/server'

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
})

export async function GET() {
  const { orgId } = await auth()

  const { data } = await clerk.organizations.getOrganizationMembershipList({
    organizationId: orgId
  })

  console.log(data)
  return NextResponse.json(data, { status: 200 })
}

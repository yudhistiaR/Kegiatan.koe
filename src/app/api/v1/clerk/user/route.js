import { auth, createClerkClient } from '@clerk/nextjs/server'

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
})

export async function POST() {
  const userInformation;
}

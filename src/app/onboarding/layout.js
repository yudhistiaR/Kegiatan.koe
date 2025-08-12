import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function RootLayout({ children }) {
  if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
    redirect('/dashboard')
  }

  return <>{children}</>
}

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Toaster } from 'sonner'

export default async function RootLayout({ children }) {
  if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
    redirect('/dashboard')
  }

  return (
    <>
      {children}
      <Toaster
        richColors
        closeButton
        position="top-left"
        gap={10}
        className="z-[99999999]"
      />
    </>
  )
}

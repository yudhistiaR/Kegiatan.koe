import { auth } from '@clerk/nextjs/server'
import { Toaster } from 'sonner'

export default async function RootLayout({ children }) {
  const { sessionClaims, redirect } = await auth()

  if (sessionClaims.metadata?.onboardingComplete === true) {
    redirect('/dashboard')
  }

  return (
    <>
      <main>{children}</main>
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

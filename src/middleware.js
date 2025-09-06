import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isOnboardingRoute = createRouteMatcher(['/onboarding'])
const isPublicRoute = createRouteMatcher([
  '/',
  '/tentang-kami',
  '/why-free',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/v1/me(.*)',
  '/api/v1/(.*)',
  '/api/v2/(.*)'
])
const isProtectedRoute = createRouteMatcher(['/(.*)/laporan'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth()

  // For users visiting /onboarding, don't try to redirect
  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next()
  }

  if (!userId && !isPublicRoute(req))
    return redirectToSignIn({ returnBackUrl: req.url })

  if (userId && !sessionClaims?.metadata?.onboardingComplete) {
    const onboardingUrl = new URL('/onboarding', req.url)
    return NextResponse.redirect(onboardingUrl)
  }

  if (userId && !isPublicRoute(req)) return NextResponse.next()

  if (isProtectedRoute(req)) {
    await auth.protect(has => {
      return has({ role: 'org:ketua' })
    })
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'
    // Always run for API routes
    //'/(api|trpc)(.*)'
  ]
}

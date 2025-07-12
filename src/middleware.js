import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/v1/me(.*)',
  '/api/v1/(.*)'
])
const isProtectedRoute = createRouteMatcher(['/(.*)/laporan'])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
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

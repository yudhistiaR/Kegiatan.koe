import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const PUBLIC_ROUTES = [
  '/',
  '/tentang-kami',
  '/why-free',
  '/sign-in',
  '/sign-up',
  '/api/webhooks',
  '/api/auth'
]

export default async function middleware(req) {
  const pathname = req.nextUrl.pathname
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))

  const session = await auth.api.getSession({
    headers: req.headers
  })

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  if (session?.user && pathname === '/onboarding') {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'
  ]
}

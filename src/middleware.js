import { NextResponse } from 'next/server'

const PUBLIC_EXACT_ROUTES = ['/', '/tentang-kami', '/why-free', '/sign-in', '/sign-up']
const PUBLIC_PREFIX_ROUTES = ['/api/webhooks', '/api/auth']

function isPublicRoute(pathname) {
  if (PUBLIC_EXACT_ROUTES.includes(pathname)) {
    return true
  }

  return PUBLIC_PREFIX_ROUTES.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  )
}

function hasSessionCookie(req) {
  return req.cookies
    .getAll()
    .some(({ name }) => name.includes('better-auth') && name.includes('session_token'))
}

export default function middleware(req) {
  const pathname = req.nextUrl.pathname

  if (!hasSessionCookie(req) && !isPublicRoute(pathname)) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'
  ]
}

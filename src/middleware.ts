import { NextResponse } from 'next/server'
import { getTokenFromCookie } from '@/lib/token'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getTokenFromCookie()

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/auth/login|api/auth/logout|login|_next/static|_next/image|favicon.ico).*)'],
}


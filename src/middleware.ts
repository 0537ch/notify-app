// Auth middleware is handled client-side for localStorage-based auth
// This file is kept for future cookie-based auth implementation
import { NextResponse } from 'next/server'

export function middleware() {
  // Allow all requests - auth is handled client-side
  return NextResponse.next()
}

export const config = {
  matcher: [],
}


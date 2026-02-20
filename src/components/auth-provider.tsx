'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

// Routes that don't require authentication
const publicRoutes = ['/login', '/api/auth/login']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    console.log('🔒 Auth check - pathname:', pathname)
    console.log('📦 localStorage keys:', Object.keys(localStorage))

    // Check if current route is public
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

    if (isPublicRoute) {
      console.log('✅ Public route, allowing access')
      setIsAuthenticated(true)
      return
    }

    // Check for token in localStorage
    const token = localStorage.getItem('token')
    console.log('📝 Token found:', !!token)
    console.log('📝 Token value:', token?.substring(0, 20) + '...')

    if (!token) {
      // No token found, redirect to login
      console.log('❌ No token, redirecting to login')
      window.location.href = '/login'
      return
    }

    // Check token expiry
    const expiryTime = Number(localStorage.getItem('tokenExpiry')) || 0
    const now = new Date().getTime()

    console.log('⏰ Token expiry:', new Date(expiryTime).toISOString(), 'Now:', new Date(now).toISOString())

    if (now >= expiryTime) {
      // Token expired, redirect to login
      console.log('⏰ Token expired, redirecting to login')
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('tokenExpiry')
      window.location.href = '/login'
      return
    }

    // Token is valid
    console.log('✅ Token valid, authenticated')
    setIsAuthenticated(true)
  }, [pathname, isClient])

  // Don't render children if not authenticated (will redirect)
  if (!isAuthenticated && !publicRoutes.some(route => pathname.startsWith(route))) {
    console.log('⏳ Not authenticated yet, not rendering')
    return null
  }

  console.log('🎨 Rendering children')
  return <>{children}</>
}

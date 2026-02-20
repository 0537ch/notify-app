'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  const router = useRouter()

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Check if token is still valid
      const expiryTime = Number(localStorage.getItem('tokenExpiry')) || 0
      const now = new Date().getTime()

      if (now < expiryTime) {
        // Token still valid, redirect to home
        router.push('/')
      }
    }
  }, [router])

  return <LoginForm />
}

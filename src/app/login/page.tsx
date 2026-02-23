'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          router.push('/')
        }
      } catch (error) {
      }
    }

    checkAuth()
  }, [router])

  return <LoginForm />
}

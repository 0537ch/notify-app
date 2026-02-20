'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!credentials.username || !credentials.password) {
      toast.error('Username dan password harus diisi')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login gagal')
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.username)

      // Set token expiry (default 24 hours if not provided by API)
      const expiresIn = data.expiresIn || (24 * 60 * 60) // 24 hours in seconds
      const expiryTime = new Date().getTime() + (expiresIn * 1000)
      localStorage.setItem('tokenExpiry', expiryTime.toString())

      console.log('📝 Login successful - Token expiry:', new Date(expiryTime).toISOString())

      toast.success('Login berhasil')

      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error instanceof Error ? error.message : 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Masukkan kredensial untuk mengakses aplikasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                disabled={loading}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

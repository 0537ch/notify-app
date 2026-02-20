import { NextResponse } from 'next/server'
import { hashPassword } from '@/lib/hash'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const tokenEndpoint = process.env.TOKEN_ENDPOINT

    if (!tokenEndpoint) {
      return NextResponse.json(
        { error: 'TOKEN_ENDPOINT is not configured' },
        { status: 500 }
      )
    }

    // Hash password before sending to API
    const hashedPassword = hashPassword(password)

    console.log('🔐 Attempting login for:', username)

    // Call token endpoint
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password: hashedPassword
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Authentication failed' }))
      console.error('❌ Login failed:', errorData)
      return NextResponse.json(
        { error: errorData.error || 'Authentication failed' },
        { status: response.status }
      )
    }

    const data = await response.json()

    if (!data.token) {
      return NextResponse.json(
        { error: 'No token received from auth server' },
        { status: 401 }
      )
    }

    console.log('✅ Login successful for:', username)

    return NextResponse.json({
      token: data.token,
      expiresIn: data.expiresIn,
      username: username
    })
  } catch (error) {
    console.error('❌ Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}

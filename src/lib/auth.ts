import { NextRequest, NextResponse } from 'next/server'

export async function authMiddleware(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) 

    const tokenEndpoint = process.env.TOKEN_ENDPOINT

    if (!tokenEndpoint) {
      return NextResponse.json(
        { error: 'TOKEN_ENDPOINT is not configured' },
        { status: 500 }
      )
    }

    const verifyResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!verifyResponse.ok) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    return { token, valid: true }
  } catch (error) {
    console.error('❌ Auth middleware error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

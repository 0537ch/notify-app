import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function authMiddleware(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token by calling auth endpoint
    const tokenEndpoint = process.env.TOKEN_ENDPOINT

    if (!tokenEndpoint) {
      return NextResponse.json(
        { error: 'TOKEN_ENDPOINT is not configured' },
        { status: 500 }
      )
    }

    // Verify token with auth server
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

    // Token is valid, attach to request for downstream use
    return { token, valid: true }
  } catch (error) {
    console.error('❌ Auth middleware error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

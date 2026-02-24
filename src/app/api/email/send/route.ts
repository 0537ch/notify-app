import { NextResponse } from 'next/server'
import { getTokenFromCookie } from '@/lib/token'

export async function POST(request: Request) {
  try {
    const emailApiEndpoint = process.env.NEXT_PUBLIC_EMAIL_API_URL

    if (!emailApiEndpoint) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_EMAIL_API_URL is not configured' },
        { status: 500 }
      )
    }

    const token = await getTokenFromCookie()

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }

    // Check if request is multipart/form-data (for file attachments)
    const contentType = request.headers.get('content-type') || ''
    const isMultipart = contentType.includes('multipart/form-data')

    let body: RequestInit['body']
    let headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
    }

    if (isMultipart) {
      // Forward FormData directly (for file uploads)
      body = request.body
      // Don't set Content-Type for FormData, let the browser set it with boundary
    } else {
      // Parse JSON (for regular email without attachments)
      const jsonBody = await request.json()
      body = JSON.stringify(jsonBody)
      headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(emailApiEndpoint, {
      method: 'POST',
      headers,
      body
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      return NextResponse.json(
        errorData,
        { status: response.status }
      )
    }

    const responseData = await response.json()
    return NextResponse.json(responseData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

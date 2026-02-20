import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const emailApiEndpoint = process.env.NEXT_PUBLIC_EMAIL_API_URL

    if (!emailApiEndpoint) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_EMAIL_API_URL is not configured' },
        { status: 500 }
      )
    }

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    const body = await request.json()

    console.log('📧 Proxying email request to:', emailApiEndpoint)
    console.log('📧 Request body keys:', Object.keys(body))

    // Proxy ke email API with bearer token
    const response = await fetch(emailApiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('❌ Email API error:', errorData)
      return NextResponse.json(
        errorData,
        { status: response.status }
      )
    }

    const responseData = await response.json()
    console.log('✅ Email sent successfully')

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('❌ Error proxying email request:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { getTokenFromCookie } from '@/lib/token'

export async function GET() {
  try {
    const token = await getTokenFromCookie()

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authenticated: true
    })
  } catch (error) {
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    )
  }
}

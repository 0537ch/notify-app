import { clearTokenCookie } from '@/lib/token'

export async function POST() {
  return clearTokenCookie()
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/request'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // Páginas de auth que NO deben ser accedidas si ya estás logueado
  const authPages = ['/login', '/register', '/forgot-password', '/reset-password']

  if (token) {
    if (authPages.some(page => pathname.startsWith(page))) {
      return NextResponse.redirect(new URL('/tools', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register', '/forgot-password/:path*', '/reset-password/:path*'],
}

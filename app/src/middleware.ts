import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from "jsonwebtoken"

export function middleware(request: NextRequest) {

const tokenValue = request.cookies.get("token")?.value

if (!tokenValue) {
  return NextResponse.redirect(new URL('/signIn', request.url))
}

try {
  const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET!) as any

  if (decoded.role !== "admin") {
    return NextResponse.redirect(new URL('/signIn', request.url))
  }

  return NextResponse.next()
} catch (err) {
  return NextResponse.redirect(new URL('/signIn', request.url))
}
}

export const config = {
    matcher: '/dashboard/:path*'
}

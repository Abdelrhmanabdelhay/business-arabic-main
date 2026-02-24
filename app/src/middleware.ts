import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    // Only run middleware for dashboard routes
    if (!path.startsWith('/dashboard')) {
        return NextResponse.next()
    }

    // Check for auth token and user credentials in cookies
    const token = request.cookies.get('token')
    const userCred = JSON.parse(request.cookies.get('CRED')?.value || '{}')

    const authorized = token && userCred?.role === "admin"
    console.log({ authorized, token, userCred })
    // If not authorized, redirect to signIn
    if (!authorized) {
        return NextResponse.redirect(new URL('/signIn', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/dashboard/:path*'
}

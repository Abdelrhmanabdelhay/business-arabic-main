import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const token = request.cookies.get('token');
  const userCred = JSON.parse(request.cookies.get('CRED')?.value || '{}');
  const role = userCred?.role;


  if (path.startsWith('/dashboard')) {
    if (!token || role !== "admin") {
      return NextResponse.redirect(new URL('/signIn', request.url));
    }
  }

  if (path.startsWith('/user') || path === '/userp') {
    if (!token || role !== "user") {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (path === '/' && role === "user") {
    return NextResponse.redirect(new URL('/userp', request.url));
  }

  return NextResponse.next();
}
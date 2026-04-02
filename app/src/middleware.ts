import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const token = request.cookies.get('token');
  const userCred = JSON.parse(request.cookies.get('CRED')?.value || '{}');
  const role = userCred?.role;

  // ✅ تجاهل static و API
  if (path.startsWith('/_next') || path.startsWith('/api')) {
    return NextResponse.next();
  }



  // 🟢 Admin
  if (role === "admin") {
    if (!path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  if (role === "user") {
    const allowedPaths = ['/idea-club', '/userp' ,'/feasibility-studiesuser'];

    const isAllowed = allowedPaths.some(p => path.startsWith(p));

    if (!isAllowed) {
      return NextResponse.redirect(new URL('/userp', request.url));
    }
  }

  if (path === '/' && role === "user") {
    return NextResponse.redirect(new URL('/userp', request.url));
  }

  return NextResponse.next();
}
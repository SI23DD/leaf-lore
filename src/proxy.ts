import { NextRequest, NextResponse } from 'next/server';

// Admin cookie check — set by /admin-login page after verifying key with backend
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin')) {
    const adminKey = req.cookies.get('ll_admin_key')?.value;
    const expectedKey = process.env.ADMIN_SECRET_KEY || 'leaflore-admin-2024';
    if (adminKey !== expectedKey) {
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };

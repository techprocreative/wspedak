import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Auth is handled client-side in admin layout
  // Middleware just passes through
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};

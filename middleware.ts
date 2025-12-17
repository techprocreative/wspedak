import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/admin')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const accessToken = request.cookies.get('sb-access-token')?.value;
    const refreshToken = request.cookies.get('sb-refresh-token')?.value;

    if (!accessToken && !refreshToken) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Step 1: Verify user authentication
      const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: supabaseAnonKey,
        },
      });

      if (!userResponse.ok) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
      }

      const userData = await userResponse.json();

      // Step 2: Check if user has admin or staff role
      const roleResponse = await fetch(
        `${supabaseUrl}/rest/v1/user_roles?user_id=eq.${userData.id}&select=role`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            apikey: supabaseAnonKey,
          },
        }
      );

      if (roleResponse.ok) {
        const roles = await roleResponse.json();

        // Check if user has admin or staff role
        if (!roles.length || !['admin', 'staff'].includes(roles[0]?.role)) {
          // User is authenticated but not authorized - redirect to home
          const homeUrl = new URL('/', request.url);
          return NextResponse.redirect(homeUrl);
        }
      } else {
        // If role check fails, allow access (backwards compatibility)
        // In production, you may want to deny access instead
        console.warn('Role check failed, allowing access for backwards compatibility');
      }
    } catch (error) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};


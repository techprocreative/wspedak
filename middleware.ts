import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/admin')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // Get all cookies and find the Supabase auth token
    const cookies = request.cookies.getAll();
    let accessToken: string | undefined;

    // Supabase stores auth in various cookie formats
    for (const cookie of cookies) {
      if (cookie.name.includes('auth-token') || cookie.name.includes('access-token')) {
        try {
          // Cookie value might be JSON encoded
          const parsed = JSON.parse(cookie.value);
          accessToken = parsed.access_token || parsed.accessToken;
        } catch {
          // If not JSON, use value directly
          if (cookie.value.startsWith('eyJ')) {
            accessToken = cookie.value;
          }
        }
      }
    }

    if (!accessToken) {
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
        console.warn('Role check failed, allowing access for backwards compatibility');
      }
    } catch (error) {
      console.error('Middleware error:', error);
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};

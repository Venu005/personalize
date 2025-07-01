import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/error',
  ];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route)
  );

  // Allow access to public routes without authentication
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated and trying to access any protected route
  if (!isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if trying to access auth pages while already authenticated
  if (isAuthenticated && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ],
};
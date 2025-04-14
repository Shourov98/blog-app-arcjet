import { createMiddleware } from '@arcjet/next';
import aj from '@/lib/arcjet';
import { NextResponse } from 'next/server';
import { verifyAuth } from './lib/auth';

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|healthz).*)"],
};

const arcjetMiddleware = createMiddleware(aj);

export async function middleware(request) {
  try {
    // Apply Arcjet protection
    const arcjetResponse = await arcjetMiddleware(request);
    
    // Handle Arcjet blocking response
    if (arcjetResponse.status !== 200) {
      return arcjetResponse;
    }

    const response = NextResponse.next();

    // Protected routes check
    const protectedRoutes = ["/"];
    const publicRoutes = ['/login', '/register'];

    const isProtectedRoute = protectedRoutes.some(
      route => request.nextUrl.pathname === route || 
               request.nextUrl.pathname.startsWith(route + '/')
    );

    if (isProtectedRoute) {
      const token = request.cookies.get('token')?.value;
      
      if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      const user = await verifyAuth(token);
      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // Add Arcjet headers
    if (arcjetResponse.headers) {
      arcjetResponse.headers.forEach((value, key) => {
        response.headers.set(key, value);
      });
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

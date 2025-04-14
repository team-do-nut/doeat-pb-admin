import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_KEY } from './constants/api/authKey';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET_KEY);

    await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });

    return NextResponse.next();
  } catch (error) {
    console.error('Invalid token:', error);

    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};

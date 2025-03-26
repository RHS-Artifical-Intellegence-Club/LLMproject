import { NextRequest, NextResponse } from 'next/server';
import { signInUser, generateToken } from '@/lib/auth-service';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate user
    const user = await signInUser(email, password);

    // Create JWT token using our auth service
    const token = generateToken(user);

    // Create response
    const response = NextResponse.json(user);

    // Set cookie with JWT token
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to sign in' },
      { status: 401 }
    );
  }
}

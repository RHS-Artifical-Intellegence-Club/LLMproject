import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({ success: true });

    // Clear the auth cookie
    response.cookies.set({
      name: 'auth_token',
      value: '',
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Sign-out error:', error);
    return NextResponse.json(
      { message: 'Failed to sign out' },
      { status: 500 }
    );
  }
}

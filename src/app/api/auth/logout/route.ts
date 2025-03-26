import { NextRequest, NextResponse } from 'next/server';
import { JWT_COOKIE_NAME } from '@/lib/auth-constants';

export async function GET(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    // Clear the auth token cookie
    response.cookies.delete(JWT_COOKIE_NAME);
    console.log('Auth token cookie cleared');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { sign, verify } from 'jsonwebtoken';
import { JWT_SECRET, JWT_COOKIE_NAME } from '@/lib/auth-constants';

export async function GET(request: NextRequest) {
  try {
    // Get any existing token
    const existingToken = request.cookies.get(JWT_COOKIE_NAME)?.value;
    
    // Create a test payload
    const payload = {
      id: 999,
      email: 'test@example.com',
      timestamp: new Date().toISOString()
    };
    
    // Sign a new token
    const token = sign(payload, JWT_SECRET, { expiresIn: '1h' });
    
    // Try to verify the token we just created
    let verificationSuccess = true;
    let verificationError = null;
    let decodedToken = null;
    
    try {
      decodedToken = verify(token, JWT_SECRET);
    } catch (error) {
      verificationSuccess = false;
      verificationError = error;
    }
    
    // Try to verify any existing token
    let existingTokenValid = false;
    let existingTokenDecoded = null;
    
    if (existingToken) {
      try {
        existingTokenDecoded = verify(existingToken, JWT_SECRET);
        existingTokenValid = true;
      } catch (error) {
        // Existing token is invalid, that's okay
      }
    }
    
    // Set the newly created token as a cookie
    const response = NextResponse.json({
      success: true,
      message: 'JWT debug information',
      data: {
        jwtSecretFirstChars: JWT_SECRET.substring(0, 10) + '...',
        newToken: {
          token: token.substring(0, 20) + '...',
          verificationSuccess,
          decodedToken
        },
        existingToken: existingToken ? {
          token: existingToken.substring(0, 20) + '...',
          valid: existingTokenValid,
          decoded: existingTokenDecoded
        } : 'No existing token'
      }
    });
    
    // Set a new test cookie
    response.cookies.set({
      name: JWT_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
      sameSite: 'strict'
    });
    
    return response;
  } catch (error) {
    console.error('JWT debug error:', error);
    return NextResponse.json(
      { error: 'Error testing JWT functionality' },
      { status: 500 }
    );
  }
} 
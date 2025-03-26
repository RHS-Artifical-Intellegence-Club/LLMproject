import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getDb } from '@/lib/db';
import { JWT_SECRET, JWT_COOKIE_NAME, JWT_EXPIRES_IN } from '@/lib/auth-constants';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { email, password } = await request.json();
    console.log('Login attempt for:', email);

    // Basic validation
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get database connection
    const db = await getDb();
    
    // Find the user by email
    const user = await db.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    // Check if user exists
    if (!user) {
      console.log('Login failed: User not found for email:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      console.log('Login failed: Password mismatch for user:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('Login successful for user:', email);
    
    // Create JWT token
    const token = sign(
      {
        id: user.id,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || null
      }
    });

    // Set HTTP-only cookie
    response.cookies.set({
      name: JWT_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'strict'
    });
    
    console.log('Auth token cookie set for user:', email);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
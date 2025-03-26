import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getDb } from '@/lib/db';
import { JWT_SECRET, JWT_COOKIE_NAME } from '@/lib/auth-constants';

export async function GET(request: NextRequest) {
  try {
    // Get token from the Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const token = authHeader ? authHeader.split(' ')[1] : request.cookies.get(JWT_COOKIE_NAME)?.value;
    
    console.log('Auth check - token exists:', !!token);
    
    if (!token) {
      console.log('Authentication failed: No token found');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify the token
    try {
      const decoded = verify(token, JWT_SECRET) as { id: number; email: string };
      console.log('Token verified successfully for:', decoded.email);
      
      // Get database connection
      const db = await getDb();
      
      // Get user from database
      const user = await db.get(
        'SELECT id, email, name FROM users WHERE id = ?',
        [decoded.id]
      );
  
      if (!user) {
        console.log('User not found in database for id:', decoded.id);
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
  
      // Return user data
      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name || null
        }
      });
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}

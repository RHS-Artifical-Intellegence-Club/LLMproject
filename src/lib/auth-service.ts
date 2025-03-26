import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

// Types
export interface UserData {
  id: string;
  email: string;
  name?: string | null;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

// Mock in-memory storage for development (until database is connected)
const mockUsers: Record<string, { id: string; email: string; password: string; name?: string }> = {};

// Create a new user
export async function createUser(email: string, password: string, name?: string): Promise<UserData> {
  try {
    // Check if user already exists in the mock storage
    const existingUser = Object.values(mockUsers).find(user => user.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash the password
    const hashedPassword = await hash(password, SALT_ROUNDS);
    
    // Generate a unique ID
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Store the user in the mock storage
    mockUsers[id] = {
      id,
      email,
      password: hashedPassword,
      name
    };

    // Return user data (without password)
    return {
      id,
      email,
      name
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Sign in a user
export async function signInUser(email: string, password: string): Promise<UserData> {
  try {
    // Find the user by email in the mock storage
    const user = Object.values(mockUsers).find(user => user.email === email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify the password
    const isPasswordValid = await compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    // Return user data (without password)
    return {
      id: user.id,
      email: user.email,
      name: user.name
    };
  } catch (error) {
    console.error('Error signing in user:', error);
    throw error;
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<UserData | null> {
  try {
    // Find the user by ID in the mock storage
    const user = mockUsers[id];
    
    if (!user) {
      return null;
    }
    
    // Return user data (without password)
    return {
      id: user.id,
      email: user.email,
      name: user.name
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

// Generate a JWT token for a user
export function generateToken(user: { id: string; email: string }): string {
  return sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify JWT token and return user ID
export async function verifyToken(token: string): Promise<string | null> {
  try {
    const decoded = verify(token, JWT_SECRET) as { id: string; email: string };
    return decoded.id;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function verifyUser(email: string, password: string) {
  const user = Object.values(mockUsers).find(user => user.email === email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name
  };
}

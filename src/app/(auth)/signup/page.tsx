'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await signUp(email, password);
      router.push('/');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create account';
      setError(message);
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <Card className="bg-neutral-800 border-neutral-700 animate-fade-in-up">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-white">Sign up</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          {error && (
            <div className="mx-6 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
              {error}
            </div>
          )}
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-700 border-neutral-600 text-white focus:ring-2 focus:ring-blue-500"
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-700 border-neutral-600 text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </CardFooter>
        </Card>
      </form>
      <p className="mt-4 text-center text-gray-400">
        Already have an account?{' '}
        <Link href="/signin" className="text-blue-500 hover:text-blue-400">
          Sign in
        </Link>
      </p>
    </div>
  );
}
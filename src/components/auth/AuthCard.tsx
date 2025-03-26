'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { verifyUser, createUser } from '@/lib/auth-service';

export function AuthCard() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Set the initial form based on the current path
  useEffect(() => {
    if (pathname === '/signup') {
      setIsSignUp(true);
    } else {
      setIsSignUp(false);
    }
  }, [pathname]);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const user = await verifyUser(email, password);
      console.log('Signed in:', user);
      // Redirect to dashboard or home page after successful sign in
      router.push('/dashboard');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      const user = await createUser(email, password);
      console.log('Signed up:', user);
      // Redirect to dashboard or home page after successful sign up
      router.push('/dashboard');
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const handleToggleForm = (isSigningUp: boolean) => {
    // Update URL to match the form being shown
    router.push(isSigningUp ? '/signup' : '/signin');
    setIsSignUp(isSigningUp);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="relative w-full">
        {/* Card Title */}
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h1>
        
        {/* Forms */}
        {isSignUp ? (
          <SignUpForm
            onSubmit={handleSignUp}
            onToggleForm={() => handleToggleForm(false)}
          />
        ) : (
          <SignInForm
            onSubmit={handleSignIn}
            onToggleForm={() => handleToggleForm(true)}
          />
        )}
      </div>
    </div>
  );
} 
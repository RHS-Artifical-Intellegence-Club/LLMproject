'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { JWT_SECRET, JWT_COOKIE_NAME } from '@/lib/auth-constants';

export default function AuthDebug() {
  const { user, loading } = useAuth();
  const [meResponse, setMeResponse] = useState<any>(null);
  const [meError, setMeError] = useState<string | null>(null);
  const [cookies, setCookies] = useState<string | null>(null);

  // Test the auth state
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setMeResponse(data);
        } else {
          const errorText = await response.text();
          setMeError(`Error ${response.status}: ${errorText}`);
        }
      } catch (error) {
        setMeError(error instanceof Error ? error.message : String(error));
      }

      // Get all cookies for debugging
      if (document && document.cookie) {
        setCookies(document.cookie);
      }
    }

    if (!loading) {
      checkAuth();
    }
  }, [loading]);

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Auth Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Auth Context</h2>
          <div className="bg-black p-4 rounded overflow-auto max-h-80">
            <pre className="text-green-400">
              {loading ? 'Loading...' : JSON.stringify(user, null, 2) || 'Not logged in'}
            </pre>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">/api/auth/me Response</h2>
          <div className="bg-black p-4 rounded overflow-auto max-h-80">
            {meError ? (
              <pre className="text-red-400">{meError}</pre>
            ) : (
              <pre className="text-green-400">
                {meResponse ? JSON.stringify(meResponse, null, 2) : 'Loading...'}
              </pre>
            )}
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Cookies</h2>
          <div className="bg-black p-4 rounded overflow-auto max-h-80">
            <pre className="text-yellow-400">
              {cookies || 'No cookies found'}
            </pre>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">JWT Configuration</h2>
          <div className="bg-black p-4 rounded overflow-auto max-h-80">
            <pre className="text-blue-400">
              {`JWT_SECRET: ${JWT_SECRET.substring(0, 10)}...\nJWT_COOKIE_NAME: ${JWT_COOKIE_NAME}`}
            </pre>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex gap-4">
        <a 
          href="/api/auth/debug" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          target="_blank"
          rel="noopener noreferrer"
        >
          Test JWT API
        </a>
        <a 
          href="/signin" 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Go to Sign In
        </a>
        <a 
          href="/" 
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
} 
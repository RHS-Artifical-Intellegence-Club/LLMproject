"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { ChatProvider } from "@/lib/chat-context";
import ChatList from "@/components/ChatList";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Handle client-side mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-900">
        <div className="text-white">Loading application...</div>
      </div>
    );
  }

  // Handle authenticated state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    // If not authenticated and done loading, redirect to signin
    router.push('/signin');
    return null;
  }

  // Main chat application UI
  return (
    <ChatProvider>
      <div className="flex h-screen bg-neutral-900">
        {/* Sidebar */}
        <div className="w-64 bg-neutral-800 border-r border-neutral-700 flex flex-col">
          <ChatList />
          
          {/* User menu */}
          <div className="p-4 border-t border-neutral-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-medium">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 truncate">
                <p className="text-white truncate">{user.email}</p>
              </div>
            </div>
            
            <button
              onClick={() => logout()}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <MessageList />
          <ChatInput />
        </div>
      </div>
    </ChatProvider>
  );
}
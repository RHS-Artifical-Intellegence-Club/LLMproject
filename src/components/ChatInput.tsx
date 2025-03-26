import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/lib/chat-context';

export default function ChatInput() {
  const { sendMessage, isSending, activeSessionId } = useChat();
  const [message, setMessage] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize the textarea as user types
  useEffect(() => {
    if (textAreaRef.current) {
      // Reset height to auto to allow shrinking
      textAreaRef.current.style.height = 'auto';
      // Set height based on scroll height
      const scrollHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [message]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isSending || !activeSessionId) return;
    
    await sendMessage(message);
    setMessage('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="border-t border-neutral-700 p-4 bg-neutral-800">
      <div className="flex items-end">
        <textarea
          ref={textAreaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={activeSessionId 
            ? "Type your message..." 
            : "Select a chat to start typing..."
          }
          disabled={!activeSessionId || isSending}
          className="flex-grow resize-none rounded-lg bg-neutral-700 text-white p-3 min-h-[44px] max-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          rows={1}
        />
        
        <button
          type="submit"
          disabled={!activeSessionId || !message.trim() || isSending}
          className={`ml-2 px-4 py-3 rounded-lg text-white ${
            !activeSessionId || !message.trim() || isSending
              ? 'bg-blue-500/50 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          {isSending ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          )}
        </button>
      </div>
    </form>
  );
} 
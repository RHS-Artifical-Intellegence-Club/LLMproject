import React, { useState } from 'react';
import { Message } from '@/lib/message-service';
import { motion } from 'framer-motion';

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Determine if the message is in a loading state
  const isLoading = message.sender === 'ai' && message.status === 'sending';
  
  // Determine if the message has an error
  const hasError = message.sender === 'ai' && message.status === 'error';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`py-2 px-4 rounded-lg max-w-[70%] ${
          message.sender === 'user'
            ? 'bg-blue-600 text-white'
            : hasError 
              ? 'bg-red-700 text-white' 
              : 'bg-neutral-700 text-white'
        }`}
      >
        {isLoading ? (
          <div className="typing-animation">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        ) : (
          <>
            <p className="whitespace-pre-wrap">{message.text}</p>
            
            {hasError && message.errorMessage && (
              <div className="mt-2">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-red-300 text-xs underline"
                >
                  {isExpanded ? 'Hide error details' : 'Show error details'}
                </button>
                
                {isExpanded && (
                  <pre className="mt-1 text-xs text-red-300 whitespace-pre-wrap bg-red-900 p-2 rounded">
                    {message.errorMessage}
                  </pre>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
} 
import React, { useRef, useEffect } from 'react';
import { useChat } from '@/lib/chat-context';
import MessageItem from './MessageItem';
import { AnimatePresence, motion } from 'framer-motion';

export default function MessageList() {
  const { messages, activeSessionId, isSending } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change or a new message is being sent
  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // If no active session, show a welcome message
  if (!activeSessionId) {
    return (
      <div className="flex-grow flex items-center justify-center bg-neutral-900 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-6 rounded-xl bg-neutral-800 shadow-xl max-w-md"
        >
          <h2 className="text-2xl font-bold text-white mb-3">Welcome to ClubLLM Chat</h2>
          <p className="text-neutral-300 mb-4">
            Select an existing chat or create a new one to get started.
          </p>
          <div className="w-16 h-16 rounded-full bg-blue-600 mx-auto flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // If there are no messages, show an empty state
  if (messages.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center bg-neutral-900 p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full bg-neutral-800 mx-auto flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No messages yet</h3>
          <p className="text-neutral-400">
            Send a message to start the conversation.
          </p>
        </motion.div>
      </div>
    );
  }
  
  // Show the message list
  return (
    <div className="flex-grow overflow-y-auto bg-neutral-900 p-4">
      <div className="space-y-4 max-w-4xl mx-auto">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
} 
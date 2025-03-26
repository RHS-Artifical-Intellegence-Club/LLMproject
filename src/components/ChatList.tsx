import React, { useState } from 'react';
import { useChat } from '@/lib/chat-context';
import { motion } from 'framer-motion';

export default function ChatList() {
  const { 
    sessions, 
    activeSessionId, 
    setActiveSessionId, 
    createNewSession, 
    renameSession,
    clearSession,
    deleteSession
  } = useChat();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');
  
  const handleEditStart = (sessionId: string, currentName: string) => {
    setEditingId(sessionId);
    setNewName(currentName);
  };
  
  const handleEditSave = (sessionId: string) => {
    if (newName.trim()) {
      renameSession(sessionId, newName.trim());
    }
    setEditingId(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent, sessionId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditSave(sessionId);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };
  
  const handleClearChat = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to clear this chat?')) {
      clearSession(sessionId);
    }
  };
  
  const handleDeleteChat = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this chat?')) {
      deleteSession(sessionId);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-white">Chats</h1>
        <button
          onClick={createNewSession}
          className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          aria-label="New chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-2">
        {sessions.map((session) => (
          <motion.div
            key={session.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`flex items-center p-2 mb-1 rounded-lg cursor-pointer ${
              session.id === activeSessionId
                ? 'bg-neutral-700'
                : 'hover:bg-neutral-700/50'
            }`}
            onClick={() => setActiveSessionId(session.id)}
          >
            <div className="flex-1 min-w-0">
              {editingId === session.id ? (
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => handleEditSave(session.id)}
                  onKeyDown={(e) => handleKeyDown(e, session.id)}
                  className="w-full bg-neutral-800 text-white px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <div 
                  className="truncate text-white font-medium"
                  onDoubleClick={() => handleEditStart(session.id, session.name)}
                >
                  {session.name}
                </div>
              )}
            </div>
            
            <div className="flex space-x-1 ml-2">
              <button
                onClick={(e) => handleClearChat(session.id, e)}
                className="p-1 text-neutral-400 hover:text-white rounded"
                title="Clear chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
              
              <button
                onClick={(e) => handleDeleteChat(session.id, e)}
                className="p-1 text-neutral-400 hover:text-red-500 rounded"
                title="Delete chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 
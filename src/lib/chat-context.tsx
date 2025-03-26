'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  Message, 
  ChatSession, 
  getChatSession, 
  getAllChatSessions, 
  processMessage, 
  updateChatSessionName,
  clearChatSession,
  deleteChatSession,
  getMessages
} from './message-service';

interface ChatContextType {
  // Chat sessions
  sessions: ChatSession[];
  activeSessionId: string | null;
  setActiveSessionId: (id: string) => void;
  createNewSession: () => string;
  renameSession: (sessionId: string, name: string) => void;
  clearSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  
  // Messages
  messages: Message[];
  sendMessage: (message: string) => Promise<void>;
  isSending: boolean;
  
  // UI state helpers
  initialized: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load sessions on initial render
  useEffect(() => {
    // Get all sessions
    const allSessions = getAllChatSessions();
    setSessions(allSessions);
    
    // If no active session but sessions exist, set the first one as active
    if (allSessions.length > 0 && !activeSessionId) {
      setActiveSessionId(allSessions[0].id);
    }
    
    // If no sessions at all, create a new one
    if (allSessions.length === 0) {
      const newSessionId = createNewSessionInternal();
      setActiveSessionId(newSessionId);
    }
    
    setInitialized(true);
  }, []);
  
  // Load messages when active session changes
  useEffect(() => {
    if (activeSessionId) {
      const sessionMessages = getMessages(activeSessionId);
      setMessages(sessionMessages);
    } else {
      setMessages([]);
    }
  }, [activeSessionId]);
  
  // Create a new session
  const createNewSessionInternal = useCallback((): string => {
    const sessionId = `session-${Date.now()}`;
    const session = getChatSession(sessionId);
    setSessions(getAllChatSessions());
    return sessionId;
  }, []);
  
  const createNewSession = useCallback((): string => {
    const newSessionId = createNewSessionInternal();
    setActiveSessionId(newSessionId);
    return newSessionId;
  }, [createNewSessionInternal]);
  
  // Rename a session
  const renameSession = useCallback((sessionId: string, name: string) => {
    updateChatSessionName(sessionId, name);
    setSessions(getAllChatSessions());
  }, []);
  
  // Clear a session
  const clearSession = useCallback((sessionId: string) => {
    clearChatSession(sessionId);
    if (sessionId === activeSessionId) {
      setMessages([]);
    }
    setSessions(getAllChatSessions());
  }, [activeSessionId]);
  
  // Delete a session
  const deleteSession = useCallback((sessionId: string) => {
    const isActive = sessionId === activeSessionId;
    const wasDeleted = deleteChatSession(sessionId);
    
    if (wasDeleted) {
      const remainingSessions = getAllChatSessions();
      setSessions(remainingSessions);
      
      if (isActive) {
        if (remainingSessions.length > 0) {
          setActiveSessionId(remainingSessions[0].id);
        } else {
          const newSessionId = createNewSessionInternal();
          setActiveSessionId(newSessionId);
        }
      }
    }
  }, [activeSessionId, createNewSessionInternal]);
  
  // Send a message
  const sendMessage = useCallback(async (message: string) => {
    if (!activeSessionId || !message.trim() || isSending) return;
    
    setIsSending(true);
    
    try {
      await processMessage(activeSessionId, message);
      setMessages(getMessages(activeSessionId));
      setSessions(getAllChatSessions());
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  }, [activeSessionId, isSending]);
  
  return (
    <ChatContext.Provider
      value={{
        sessions,
        activeSessionId,
        setActiveSessionId,
        createNewSession,
        renameSession,
        clearSession,
        deleteSession,
        messages,
        sendMessage,
        isSending,
        initialized
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
} 
import { generateResponse, clearChatHistory } from './deepseek-service';

// Types
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
  status?: 'sending' | 'sent' | 'error';
  errorMessage?: string;
}

export interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  lastUpdated: number;
}

// In-memory storage for chat sessions
const chatSessions: Record<string, ChatSession> = {};

/**
 * Get or create a chat session
 */
export function getChatSession(sessionId: string, name?: string): ChatSession {
  if (!chatSessions[sessionId]) {
    chatSessions[sessionId] = {
      id: sessionId,
      name: name || `Chat ${Object.keys(chatSessions).length + 1}`,
      messages: [],
      lastUpdated: Date.now()
    };
  }
  return chatSessions[sessionId];
}

/**
 * Get all chat sessions
 */
export function getAllChatSessions(): ChatSession[] {
  return Object.values(chatSessions)
    .sort((a, b) => b.lastUpdated - a.lastUpdated);
}

/**
 * Update chat session name
 */
export function updateChatSessionName(sessionId: string, name: string): void {
  const session = getChatSession(sessionId);
  session.name = name;
  session.lastUpdated = Date.now();
}

/**
 * Add a message to a chat session
 */
export function addMessage(sessionId: string, message: Omit<Message, 'id' | 'timestamp'>): Message {
  const session = getChatSession(sessionId);
  const newMessage: Message = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: Date.now(),
    ...message
  };
  
  session.messages.push(newMessage);
  session.lastUpdated = Date.now();
  
  return newMessage;
}

/**
 * Process a user message and get AI response
 */
export async function processMessage(sessionId: string, userMessage: string): Promise<Message> {
  try {
    // Add user message to chat
    const userMsg = addMessage(sessionId, {
      text: userMessage,
      sender: 'user'
    });
    
    // Add a placeholder for the AI message
    const placeholderMsg = addMessage(sessionId, {
      text: '',
      sender: 'ai',
      status: 'sending'
    });
    
    // Get response from AI
    try {
      const aiResponse = await generateResponse(userMessage, sessionId);
      
      // Update the placeholder message with the actual response
      const session = getChatSession(sessionId);
      const messageIndex = session.messages.findIndex(m => m.id === placeholderMsg.id);
      
      if (messageIndex !== -1) {
        session.messages[messageIndex] = {
          ...placeholderMsg,
          text: aiResponse,
          status: 'sent'
        };
      }
      
      return session.messages[messageIndex];
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Update placeholder with error message
      const session = getChatSession(sessionId);
      const messageIndex = session.messages.findIndex(m => m.id === placeholderMsg.id);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (messageIndex !== -1) {
        session.messages[messageIndex] = {
          ...placeholderMsg,
          text: "Sorry, I couldn't process your message. Please try again.",
          status: 'error',
          errorMessage
        };
      }
      
      return session.messages[messageIndex];
    }
  } catch (error) {
    console.error('Error in message processing:', error);
    throw error;
  }
}

/**
 * Clear all messages in a chat session
 */
export function clearChatSession(sessionId: string): void {
  const session = getChatSession(sessionId);
  session.messages = [];
  session.lastUpdated = Date.now();
  
  // Also clear the chat history in the AI service
  clearChatHistory(sessionId);
}

/**
 * Delete a chat session
 */
export function deleteChatSession(sessionId: string): boolean {
  if (chatSessions[sessionId]) {
    delete chatSessions[sessionId];
    return true;
  }
  return false;
}

/**
 * Get messages for a chat session
 */
export function getMessages(sessionId: string): Message[] {
  const session = getChatSession(sessionId);
  return [...session.messages];
}

// Initialize with some data if needed
// This can be removed in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const demoSession = getChatSession('demo');
  if (demoSession.messages.length === 0) {
    addMessage('demo', { text: 'Hello, I am Pluto!', sender: 'ai' });
    demoSession.name = 'Welcome Chat';
  }
} 
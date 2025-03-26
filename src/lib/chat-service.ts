// Types
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  message?: string; // For compatibility with existing code
  response?: string; // For compatibility with existing code
}

// In-memory storage for chat messages by tabId
const chatStorage: Record<string, any[]> = {};

// Save chat message and response
export async function saveChat(message: string, response: string, tabId: string): Promise<void> {
  try {
    // Initialize chat storage if it doesn't exist
    if (!chatStorage[tabId]) {
      chatStorage[tabId] = [];
    }

    // Create a simple chat entry
    const chatEntry = {
      id: Math.random().toString(36).substring(2, 15),
      message,
      response,
      timestamp: new Date()
    };

    // Add to storage
    chatStorage[tabId].push(chatEntry);
    
    console.log(`Saved chat for tab ${tabId}`);
    return;
  } catch (error) {
    console.error('Error saving chat:', error);
    throw error;
  }
}

// Send a message and get AI response
export async function sendMessage(chatId: string, content: string): Promise<string> {
  try {
    // Call the AI API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: content, chatId }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Get chat history
export async function getChatHistory(tabId: string): Promise<any[]> {
  return chatStorage[tabId] || [];
}

// Create a new chat
export async function createNewChat(): Promise<string> {
  const chatId = Math.random().toString(36).substring(2, 15);
  chatStorage[chatId] = [];
  return chatId;
}

// Get all chats
export async function getAllChats(): Promise<{ id: string; messages: any[] }[]> {
  return Object.entries(chatStorage).map(([id, messages]) => ({
    id,
    messages
  }));
}
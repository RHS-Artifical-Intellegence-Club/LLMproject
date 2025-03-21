import { auth } from './firebase';

interface ChatMessage {
  message: string;
  response: string;
  timestamp?: Date;
}

export async function saveChat(message: string, response: string, tabId: number): Promise<ChatMessage> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const res = await fetch('/api/chat-history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: user.uid,
      tabId,
      message,
      response,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to save chat');
  }

  return res.json();
}

export async function getChatHistory(tabId: number): Promise<ChatMessage[]> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const res = await fetch(`/api/chat-history?userId=${user.uid}&tabId=${tabId}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch chat history');
  }

  return res.json();
} 
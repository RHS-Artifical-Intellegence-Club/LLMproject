import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Initialize OpenRouter client
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "X-Title": "ClubLLM Chat",
  }
});

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// Store conversation history in memory (temporary solution)
const conversationHistory = new Map<number, ChatMessage[]>();

export async function POST(request: Request) {
  try {
    const { message, tabId } = await request.json();

    if (!message || tabId === undefined) {
      return NextResponse.json({ error: 'Message and tabId are required' }, { status: 400 });
    }

    // Get or initialize conversation history for this tab
    if (!conversationHistory.has(tabId)) {
      conversationHistory.set(tabId, [
        {
          role: "system",
          content: "You are a helpful AI assistant. Respond directly to the user's questions and maintain context of the conversation."
        }
      ]);
    }

    const history = conversationHistory.get(tabId)!;
    
    // Add user message to history
    history.push({
      role: "user",
      content: message
    });

    // Create chat completion using OpenRouter with conversation history
    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: history
    });

    // Extract the assistant's response
    const aiResponse = completion.choices[0].message.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Add assistant response to history
    history.push({
      role: "assistant",
      content: aiResponse
    });

    // Update conversation history
    conversationHistory.set(tabId, history);

    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    );
  }
} 
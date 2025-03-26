import { NextRequest, NextResponse } from 'next/server';
import { getChatHistory, saveChat } from '@/lib/chat-service';

export async function GET(request: NextRequest) {
  try {
    // Get tab ID from query params
    const url = new URL(request.url);
    const tabId = url.searchParams.get('tabId');

    if (!tabId) {
      return NextResponse.json(
        { error: 'Tab ID is required' },
        { status: 400 }
      );
    }

    // Get chat history for the tab
    const history = await getChatHistory(tabId);

    return NextResponse.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Chat history API error:', error);
    return NextResponse.json(
      { error: 'Failed to get chat history' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { message, response, tabId } = await request.json();

    // Validate required fields
    if (!message || !response || !tabId) {
      return NextResponse.json(
        { error: 'Message, response, and tabId are required' },
        { status: 400 }
      );
    }

    // Save the chat
    await saveChat(message, response, tabId);

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Save chat history API error:', error);
    return NextResponse.json(
      { error: 'Failed to save chat' },
      { status: 500 }
    );
  }
} 
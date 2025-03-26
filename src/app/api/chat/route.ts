import { NextResponse } from 'next/server';
import { generateResponse } from '@/lib/deepseek-service';

export async function POST(req: Request) {
  console.log("Chat API POST request received");
  try {
    // Parse request
    const body = await req.json();
    console.log("Request body:", JSON.stringify(body));
    
    // Validate input
    if (!body.message || typeof body.message !== 'string') {
      console.error("Invalid message format:", body.message);
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
    }
    
    if (!body.chatId || typeof body.chatId !== 'string') {
      console.error("Invalid chatId:", body.chatId);
      return NextResponse.json({ error: "Invalid chatId" }, { status: 400 });
    }

    // Process the message using DeepSeek
    const result = await generateResponse(body.message, body.chatId);
    console.log("Generated response:", result);
    
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error in Chat API:", error);
    return NextResponse.json(
      { error: `Failed to process message: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clubllm';

// Define Chat Schema
const chatSchema = new mongoose.Schema({
  userId: String,
  tabId: Number,
  message: String,
  response: String,
  timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

// Connect to MongoDB
let isConnected = false;
async function dbConnect() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const tabId = searchParams.get('tabId');

    if (!userId || !tabId) {
      return NextResponse.json({ error: 'Missing userId or tabId' }, { status: 400 });
    }

    await dbConnect();

    const chats = await Chat.find({ 
      userId, 
      tabId: parseInt(tabId) 
    })
      .sort({ timestamp: 1 })
      .exec();

    return NextResponse.json(chats);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'An error occurred fetching chat history' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, tabId, message, response } = await request.json();

    if (!userId || !tabId || !message || !response) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    const chat = new Chat({
      userId,
      tabId,
      message,
      response,
      timestamp: new Date()
    });

    await chat.save();
    return NextResponse.json(chat);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'An error occurred saving the chat' },
      { status: 500 }
    );
  }
} 
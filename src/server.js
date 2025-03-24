const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db/db');
const Chat = require('./models/Chat');
const authenticateUser = require('./middleware/auth');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow your Next.js frontend
  credentials: true
}));
app.use(bodyParser.json());

// Connect to MongoDB
connectDB().catch(console.error);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test route for authentication
app.post('/api/auth/test', authenticateUser, (req, res) => {
  res.json({ 
    message: 'Authentication successful',
    user: req.user 
  });
});

// Protected Routes
app.post('/api/chat', authenticateUser, async (req, res) => {
  try {
    const { message, response } = req.body;
    const userId = req.user.uid;
    
    if (!message || !response) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['message', 'response']
      });
    }

    const chat = new Chat({
      userId,
      message,
      response,
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    console.error('Error saving chat:', error);
    res.status(500).json({ error: 'Error saving chat message' });
  }
});

app.get('/api/chat/history', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const chats = await Chat.find({ userId }).sort({ timestamp: -1 });
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Error fetching chat history' });
  }
});

// User profile route
app.get('/api/user/profile', authenticateUser, async (req, res) => {
  try {
    res.json({
      uid: req.user.uid,
      email: req.user.email
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
}); 
import { ChatOpenAI } from "@langchain/openai";

// Constants for OpenRouter configuration
const MODEL = "deepseek/deepseek-chat";
const DEFAULT_TEMPERATURE = 0.7;
const SYSTEM_PROMPT = "You are ClubLLM, a helpful AI assistant. Be concise, friendly, and informative.";
// OpenRouter API key
const OPENROUTER_API_KEY = "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";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

// In-memory store for chat history by chatId
const chatHistoryStore: Record<string, { role: string; content: string }[]> = {};

/**
 * Initialize or retrieve chat history for a specific chat
 */
function getChatHistory(chatId: string) {
  if (!chatHistoryStore[chatId]) {
    chatHistoryStore[chatId] = [
      { role: "system", content: SYSTEM_PROMPT }
    ];
  }
  return chatHistoryStore[chatId];
}

/**
 * OpenRouter wrapper for generating responses
 */
export async function generateResponse(message: string, chatId: string): Promise<string> {
  try {
    console.log(`OpenRouter processing message for chat ${chatId}: "${message}"`);
    
    // Get chat history for this chatId
    const history = getChatHistory(chatId);
    
    // Add user message to history
    history.push({ role: "user", content: message });
    
    // Create OpenRouter client using LangChain's ChatOpenAI with proper authentication
    const chat = new ChatOpenAI({
      modelName: MODEL,
      temperature: DEFAULT_TEMPERATURE,
      openAIApiKey: OPENROUTER_API_KEY,
      configuration: {
        baseURL: OPENROUTER_BASE_URL,
        defaultHeaders: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/RHS-Artifical-Intellegence-Club/LLMproject", // Required by OpenRouter
          "X-Title": "ClubLLM" // Optional, but good for tracking
        },
      },
      maxTokens: 1000,
      streaming: false
    });
    
    // Format messages for the API
    const formattedMessages = history.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Call OpenRouter API
    console.log("Sending formatted messages to OpenRouter");
    
    const response = await chat.invoke(formattedMessages);
    
    // Extract response content
    const responseContent = typeof response.content === 'string' 
      ? response.content 
      : JSON.stringify(response.content);
    
    console.log("OpenRouter response:", responseContent);
    
    // Add assistant response to history
    history.push({ role: "assistant", content: responseContent });
    
    return responseContent;
  } catch (error) {
    console.error("Error generating OpenRouter response:", error);
    throw error;
  }
}

/**
 * Clear chat history for a specific chatId
 */
export function clearChatHistory(chatId: string): void {
  if (chatHistoryStore[chatId]) {
    // Keep only the system prompt
    chatHistoryStore[chatId] = [
      { role: "system", content: SYSTEM_PROMPT }
    ];
  }
} 

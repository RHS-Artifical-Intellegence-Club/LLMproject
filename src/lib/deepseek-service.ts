import { ChatOpenAI } from "@langchain/openai";

// Constants for OpenRouter configuration
const OPENROUTER_MODEL = "deepseek/deepseek-chat";
const DEFAULT_TEMPERATURE = 0.7;
const SYSTEM_PROMPT = "You are Pluto, a helpful AI assistant. Be concise, friendly, and informative.";
// Hard-coded API key
const OPENROUTER_API_KEY = "key";
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
    const openRouterChat = new ChatOpenAI({
      modelName: OPENROUTER_MODEL,
      temperature: DEFAULT_TEMPERATURE,
      openAIApiKey: OPENROUTER_API_KEY,
      configuration: {
        baseURL: OPENROUTER_BASE_URL,
        defaultHeaders: {
          "HTTP-Referer": "https://clubllm.com", // Optional, helps with analytics
          "X-Title": "ClubLLM" // Optional, helps with analytics
        },
      },
    });
    
    // Format messages for the API
    const formattedMessages = history.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Call OpenRouter API
    console.log("Sending formatted messages to OpenRouter");
    
    const response = await openRouterChat.invoke(formattedMessages);
    
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

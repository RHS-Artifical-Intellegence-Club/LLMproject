"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { saveChat, getChatHistory } from "@/lib/chat-service";

interface Message {
  tabId: number;
  role: 'user' | 'assistant';
  text: string;
}

export default function Home() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [tabs, setTabs] = useState<{ id: number; name: string }[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && tabs.length > 0) {
      // Load chat history for all tabs when user logs in
      const loadAllChatHistory = async () => {
        for (const tab of tabs) {
          try {
            const history = await getChatHistory(tab.id);
            if (history.length > 0) {
              const formattedMessages = history.map(chat => [
                { tabId: tab.id, role: 'user' as const, text: chat.message },
                { tabId: tab.id, role: 'assistant' as const, text: chat.response }
              ]).flat();
              setMessages(prevMessages => [...prevMessages, ...formattedMessages]);
            }
          } catch (error) {
            console.error(`Error loading chat history for tab ${tab.id}:`, error);
          }
        }
      };
      loadAllChatHistory();
    }
  }, [loading, user, router, tabs]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addTab = () => {
    const newTabId = tabs.length + 1;
    setTabs((prevTabs) => [
      ...prevTabs,
      { id: newTabId, name: `Project ${newTabId}` },
    ]);
    setActiveTabId(newTabId);
  };

  const updateTabName = (id: number, newName: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === id ? { ...tab, name: newName || `Project ${tab.id}` } : tab
      )
    );
  };

  const handleTabSelect = (tabId: number) => {
    setActiveTabId(tabId);
    setMessages([]); // Clear messages when switching tabs
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/signin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    if (activeTabId) {
      loadChatHistory();
    }
  }, [activeTabId]);

  const loadChatHistory = async () => {
    if (!activeTabId) return;
    
    try {
      const history = await getChatHistory(activeTabId);
      const formattedMessages = history.map(chat => [
        { tabId: activeTabId, role: 'user' as const, text: chat.message },
        { tabId: activeTabId, role: 'assistant' as const, text: chat.response }
      ]).flat();
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!activeTabId || !prompt.trim()) return;

    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { tabId: activeTabId, role: 'user', text: prompt },
    ]);
    
    setIsLoading(true);
    const userMessage = prompt;
    setPrompt("");

    try {
      // Get AI response
      const aiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          tabId: activeTabId 
        }),
      });

      const data = await aiResponse.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage = data.response;

      // Add AI response to messages
      setMessages((prevMessages) => [
        ...prevMessages,
        { tabId: activeTabId, role: 'assistant', text: assistantMessage },
      ]);

      // Save the chat to MongoDB
      try {
        await saveChat(userMessage, assistantMessage, activeTabId);
      } catch (saveError) {
        console.error('Error saving chat:', saveError);
        // Don't show error to user since the message was displayed successfully
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { tabId: activeTabId, role: 'assistant', text: 'Sorry, an error occurred. Please try again.' },
      ]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Add effect to persist tabs in localStorage
  useEffect(() => {
    // Load tabs from localStorage on initial load
    const savedTabs = localStorage.getItem('chatTabs');
    if (savedTabs) {
      const parsedTabs = JSON.parse(savedTabs);
      setTabs(parsedTabs);
      if (parsedTabs.length > 0) {
        setActiveTabId(parsedTabs[0].id);
      }
    }
  }, []);

  // Save tabs to localStorage whenever they change
  useEffect(() => {
    if (tabs.length > 0) {
      localStorage.setItem('chatTabs', JSON.stringify(tabs));
    }
  }, [tabs]);

  if (loading || !user) {
    return null;
  }

  return (
    <div className="bg-neutral-900 h-screen flex">
      {/* project window */}
      <div className="flex flex-col w-1/6 bg-neutral-800 content-center h-full">
        <div className="flex items-center justify-between px-4 mt-4">
          <h1 className="text-3xl text-white font-serif">Projects</h1>
          <button
            onClick={addTab}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <span className="text-lg font-bold">+</span>
          </button>
        </div>
        <div className="mt-4 px-2 flex-1">
          {tabs.map((tab) => (
            <EditableTab
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTabId}
              onSelect={() => handleTabSelect(tab.id)}
              onUpdateName={(newName) => updateTabName(tab.id, newName)}
            />
          ))}
        </div>
        <div className="p-4 border-t border-neutral-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* main area */}
      <div className="flex flex-col flex-grow">
        <div className="flex-grow bg-neutral-900 p-4 overflow-y-auto">
          {activeTabId ? (
            <div className="space-y-4">
              {messages
                .filter((message) => message.tabId === activeTabId)
                .map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`py-2 px-4 rounded-lg max-w-[70%] ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-700 text-white'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>
                  </div>
                ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-700 text-white py-2 px-4 rounded-lg">
                    <div className="typing-animation">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="h-1/4 w-1/4 flex items-center justify-center bg-zinc-950 rounded-2xl">
                <h2 className="text-white text-2xl p-4 font-serif">
                  No Project Selected
                </h2>
              </div>
            </div>
          )}
        </div>

        {/* input box */}
        <div className="bg-neutral-800 p-4 border-t border-neutral-600">
          <div className="flex items-center">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={activeTabId ? "Type your message..." : "Select a project to start chatting"}
              disabled={!activeTabId}
              className="flex-grow px-4 py-2 rounded-lg bg-neutral-700 text-white focus:outline-none resize-none min-h-[44px] max-h-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              style={{
                height: 'auto',
                minHeight: '44px',
                maxHeight: '200px',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !prompt.trim() || !activeTabId}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-serif disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .typing-animation {
          display: flex;
          gap: 4px;
          align-items: center;
          height: 20px;
        }

        .dot {
          width: 4px;
          height: 4px;
          background-color: white;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        textarea {
          overflow-y: hidden;
        }
      `}</style>
    </div>
  );
}

type TabProps = {
  tab: { id: number; name: string };
  isActive: boolean;
  onSelect: () => void;
  onUpdateName: (newName: string) => void;
};

function EditableTab({ tab, isActive, onSelect, onUpdateName }: TabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(tab.name);

  const handleBlur = () => {
    setIsEditing(false);
    onUpdateName(name);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  return (
    <div
      className={`bg-neutral-700 text-white py-2 px-3 mb-2 rounded-lg text-sm flex items-center cursor-pointer ${
        isActive ? "bg-blue-600" : "bg-neutral-700"
      }`}
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="flex-grow bg-neutral-600 text-white py-1 px-2 rounded focus:outline-none"
        />
      ) : (
        <span className="flex-grow">{tab.name}</span>
      )}
    </div>
  );
}
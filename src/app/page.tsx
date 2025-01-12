"use client";

import { useState } from "react";

export default function Home() {
  const [tabs, setTabs] = useState<{ id: number; name: string }[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [messages, setMessages] = useState<{ tabId: number; text: string }[]>([]);
  const [PROMPT, setPROMPT] = useState(""); // store user input here

  const addTab = () => {
    setTabs((prevTabs) => [
      ...prevTabs,
      { id: prevTabs.length + 1, name: `Tab ${prevTabs.length + 1}` },
    ]);
    if (tabs.length === 0) {
      setActiveTabId(1); // automatically select the first tab
    }
  };

  const updateTabName = (id: number, newName: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === id ? { ...tab, name: newName || `Tab ${tab.id}` } : tab
      )
    );
  };

  const sendMessage = () => {
    if (!activeTabId || !PROMPT.trim()) return;

    // print the prompt to the terminal
    console.log("PROMPT:", PROMPT);

    setMessages((prevMessages) => [
      ...prevMessages,
      { tabId: activeTabId, text: PROMPT },
    ]);
    setPROMPT(""); // clear prompt after sending
  };

  return (
    <div className="bg-neutral-900 h-screen flex">
      {/* project window */}
      <div className="flex flex-col w-1/6 bg-neutral-800 rounded-2xl content-center h-full">
        <div className="flex items-center justify-between px-4 mt-4">
          <h1 className="text-3xl text-white">Projects</h1>
          <button
            onClick={addTab}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <span className="text-lg font-bold">+</span>
          </button>
        </div>
        <div className="mt-4 px-2">
          {tabs.map((tab) => (
            <EditableTab
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTabId}
              onSelect={() => setActiveTabId(tab.id)}
              onUpdateName={(newName) => updateTabName(tab.id, newName)}
            />
          ))}
        </div>
      </div>

      {/* main area */}
      <div className="flex flex-col flex-grow">
        <div className="flex-grow bg-neutral-900 p-4 overflow-y-auto">
          {activeTabId ? (
            <div>
              {messages
                .filter((message) => message.tabId === activeTabId)
                .map((message, index) => (
                  <div
                    key={index}
                    className="bg-blue-600 text-white py-2 px-4 mb-2 rounded-lg max-w-xs ml-auto"
                  >
                    {message.text}
                  </div>
                ))}
            </div>
          ) : (
            <h2 className="text-white text-2xl p-4">No Project Selected</h2>
          )}
        </div>
        {/* input box at bottom of the screen */}
        <div className="bg-neutral-800 p-4 border-t border-neutral-600">
          <div className="flex items-center">
            <input
              type="text"
              value={PROMPT} // use prompt to store user input
              onChange={(e) => setPROMPT(e.target.value)} // update prompt as user types
              placeholder="Type the prompt"
              className="flex-grow px-4 py-2 rounded-lg bg-neutral-700 text-white focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
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
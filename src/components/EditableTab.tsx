import { useState, useRef, useEffect } from 'react';

interface TabProps {
  tab: {
    id: number;
    name: string;
  };
  isActive: boolean;
  onSelect: () => void;
  onUpdateName: (newName: string) => void;
}

export default function EditableTab({ tab, isActive, onSelect, onUpdateName }: TabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(tab.name);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue.trim() !== tab.name) {
      onUpdateName(editValue.trim() || `Project ${tab.id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (editValue.trim() !== tab.name) {
        onUpdateName(editValue.trim() || `Project ${tab.id}`);
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(tab.name);
    }
  };

  return (
    <div
      className={`p-3 mb-2 rounded-md cursor-pointer transition-colors ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'bg-neutral-700 text-gray-200 hover:bg-neutral-600'
      }`}
      onClick={!isEditing ? onSelect : undefined}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full bg-white text-black px-2 py-1 rounded outline-none"
          onClick={(e) => e.stopPropagation()} // Prevent tab selection when clicking input
        />
      ) : (
        <span className="truncate block">{tab.name}</span>
      )}
    </div>
  );
} 
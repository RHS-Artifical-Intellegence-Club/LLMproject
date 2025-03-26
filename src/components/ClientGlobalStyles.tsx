'use client';

import React, { useEffect, useState } from 'react';

export default function ClientGlobalStyles() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Only run on client-side
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only inject styles once the component is mounted on the client
    if (!isMounted) return;

    // Inject the global styles
    const style = document.createElement('style');
    style.innerHTML = `
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
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      document.head.removeChild(style);
    };
  }, [isMounted]);

  return null; // This component doesn't render anything
} 
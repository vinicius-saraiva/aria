'use client';

import { useState, useRef, useEffect } from 'react';
import { LocationData } from './WeatherApp';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatPanelProps {
  selectedLocation: LocationData | null;
}

export default function ChatPanel({ selectedLocation }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your sailing weather assistant. Select a location on the map or enter coordinates, and I\'ll help you understand the weather conditions for sailing. You can ask me about wind patterns, weather systems, or any sailing-related questions!',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // When a location is selected, add a helpful message
  useEffect(() => {
    if (selectedLocation) {
      const locationMessage = `Location selected: ${selectedLocation.lat.toFixed(4)}°N, ${selectedLocation.lon.toFixed(4)}°E. You can now ask me about the weather conditions here!`;
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: locationMessage,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [selectedLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          location: selectedLocation,
          screenshot: selectedLocation?.screenshot,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const insertLocationIntoMessage = () => {
    if (selectedLocation) {
      const locationText = `What are the weather conditions at ${selectedLocation.lat.toFixed(4)}°N, ${selectedLocation.lon.toFixed(4)}°E?`;
      setInput(locationText);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white">
        <h2 className="text-lg font-bold">AI Weather Assistant</h2>
        <p className="text-sm text-blue-100">Ask me anything about sailing weather</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-white border border-gray-200">
              <p className="text-sm text-gray-500">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        {selectedLocation && (
          <div className="mb-2 flex items-center gap-2">
            <button
              onClick={insertLocationIntoMessage}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Ask about selected location ({selectedLocation.lat.toFixed(2)}°,{' '}
              {selectedLocation.lon.toFixed(2)}°)
            </button>
            {selectedLocation.screenshot && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                📸 Screenshot ready
              </span>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about weather conditions, wind patterns..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

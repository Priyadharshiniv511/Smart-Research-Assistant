import React, { useState, useRef, useEffect } from 'react';
import { Send, KeyRound } from 'lucide-react';
import MessageBubble from './MessageBubble';
import Loader from './Loader';
import { queryAssistant } from '../services/api';
import { v4 as uuidv4 } from 'uuid';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Smart Research Assistant. Please provide your Gemini API Key below, upload some PDFs, and ask me any questions.' }
  ]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Persist session ID
  const [sessionId] = useState(() => uuidv4());
  
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    if (!apiKey.trim()) {
      alert("Please enter your Gemini API Key first.");
      return;
    }

    const currentInput = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: currentInput }]);
    setIsLoading(true);

    try {
      const response = await queryAssistant(currentInput, sessionId, apiKey);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.answer,
        citations: response.citations,
        source: response.source,
        confidence: response.confidence
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.response?.data?.detail || error.message || 'Something went wrong.'}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Header with API Key Input */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Research Chat</h2>
          <p className="text-xs text-slate-500">Ask questions about your uploaded PDFs</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm w-full sm:w-auto">
          <KeyRound className="w-4 h-4 text-slate-400" />
          <input
            type="password"
            placeholder="Gemini API Key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="text-sm outline-none text-slate-700 bg-transparent w-full sm:w-48 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex w-full justify-start mb-6">
            <Loader />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || !apiKey.trim()}
            placeholder={!apiKey.trim() ? "Enter API Key to chat..." : "Ask a question..."}
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-3 pl-5 pr-12 text-[15px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:bg-slate-100"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !apiKey.trim()}
            className="absolute right-2 p-2 bg-primary text-white rounded-full hover:bg-blue-600 transition disabled:opacity-50 disabled:hover:bg-primary shadow-sm"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;

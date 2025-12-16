import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
        const apiKey = localStorage.getItem('nst_gemini_api_key');
        if (!apiKey) throw new Error("API Key Missing");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const result = await model.generateContent(input);
        const response = await result.response;
        const text = response.text();

        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text }]);
    } catch (error) {
        setMessages(prev => [...prev, { 
            id: (Date.now() + 1).toString(), 
            role: 'ai', 
            text: "Error: I can't connect right now. Please check if the Admin has set the API Key." 
        }]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6" />
            <h2 className="font-bold">Gemini Assistant</h2>
        </div>
        <button onClick={() => setMessages([])} className="text-blue-200 hover:text-white" title="Clear Chat">
            <Trash2 size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
                <Bot className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>Ask me anything about your studies!</p>
            </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
            <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button 
                onClick={handleSend}
                disabled={loading}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
                <Send size={20} />
            </button>
        </div>
      </div>
    </div>
  );
}

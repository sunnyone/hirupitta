'use client';

import React, { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'agent';
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
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
        body: JSON.stringify({ query: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const agentMessage: Message = {
        id: Date.now().toString(),
        text: data.response,
        sender: 'agent',
      };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'エラーが発生しました。もう一度お試しください。',
        sender: 'agent',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Hirupitta</h1>
        <p>今日の気分に合ったレストランを提案します</p>
      </header>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            「今日は和食が食べたい」や「静かな場所でランチしたい」など、あなたの気分を教えてください。
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'agent-message'}`}
            >
              {message.text}
            </div>
          ))
        )}
        {isLoading && (
          <div className="loading">
            <div className="loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力..."
          className="message-input"
          disabled={isLoading}
        />
        <button type="submit" className="send-button" disabled={isLoading}>
          送信
        </button>
      </form>
    </div>
  );
}

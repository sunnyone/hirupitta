'use client';

import React, { useState, useRef, useEffect } from 'react';
import { css } from '../styled-system/css';
import { flex, stack, center } from '../styled-system/patterns';

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

      console.log(data);
      const agentMessage: Message = {
        id: Date.now().toString(),
        text: data.response?.text?.toString(),
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

  const chatContainer = css({
    maxWidth: '800px',
    margin: '0 auto',
    padding: 'lg',
  });

  const chatHeader = css({
    textAlign: 'center',
    marginBottom: 'lg',
  });

  const messagesContainer = css({
    display: 'flex',
    flexDirection: 'column',
    gap: 'md',
    marginBottom: 'lg',
    maxHeight: '500px',
    overflowY: 'auto',
    padding: 'md',
    border: '1px solid token(colors.border)',
    borderRadius: 'sm',
  });

  const emptyStateMessage = css({
    textAlign: 'center',
    padding: 'lg',
    color: '#666',
  });

  const messageStyle = css({
    padding: '10px 15px',
    borderRadius: 'md',
    maxWidth: '80%',
  });

  const userMessageStyle = css({
    alignSelf: 'flex-end',
    backgroundColor: 'token(colors.primary)',
    color: 'white',
  });

  const agentMessageStyle = css({
    alignSelf: 'flex-start',
    backgroundColor: 'token(colors.secondary)',
    color: 'token(colors.text)',
  });

  const inputContainer = flex({
    gap: 'md',
  });

  const messageInput = css({
    flexGrow: 1,
    padding: 'md',
    border: '1px solid token(colors.border)',
    borderRadius: 'sm',
  });

  const sendButton = css({
    padding: '10px 20px',
    backgroundColor: 'token(colors.primary)',
    color: 'white',
    border: 'none',
    borderRadius: 'sm',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#0060df',
    },
  });

  const loading = center({
    margin: '10px 0',
  });

  const loadingDots = flex({
    gap: 'sm',
  });

  const loadingDot = css({
    width: '8px',
    height: '8px',
    backgroundColor: 'token(colors.primary)',
    borderRadius: '50%',
    animation: 'bounce 1.4s infinite ease-in-out both',
    '&:nth-child(1)': {
      animationDelay: '-0.32s',
    },
    '&:nth-child(2)': {
      animationDelay: '-0.16s',
    },
  });

  const keyframes = {
    bounce: {
      '0%, 80%, 100%': {
        transform: 'scale(0)',
      },
      '40%': {
        transform: 'scale(1)',
      },
    },
  };

  return (
    <div className={chatContainer}>
      <header className={chatHeader}>
        <h1>Hirupitta</h1>
        <p>今日の気分に合ったレストランを提案します</p>
      </header>

      <div className={messagesContainer}>
        {messages.length === 0 ? (
          <div className={emptyStateMessage}>
            「今日は和食が食べたい」や「静かな場所でランチしたい」など、あなたの気分を教えてください。
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`${messageStyle} ${msg.sender === 'user' ? userMessageStyle : agentMessageStyle}`}
            >
              {msg.text}
            </div>
          ))
        )}
        {isLoading && (
          <div className={loading}>
            <div className={loadingDots}>
              <div className={loadingDot}></div>
              <div className={loadingDot}></div>
              <div className={loadingDot}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力..."
          className={messageInput}
          disabled={isLoading}
        />
        <button type="submit" className={sendButton} disabled={isLoading}>
          送信
        </button>
      </form>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import type { Message, ChatState } from '../types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import PhoneNumberInput from './PhoneNumberInput';
import LoadingSpinner from './LoadingSpinner';
import { chatService } from '../services/chatService';
import { smsService } from '../services/smsService';
import './ChatInterface.css';

const ChatInterface: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'sms'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
      type: activeTab,
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      if (activeTab === 'chat') {
        const response = await chatService.sendMessage(content);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          role: 'assistant',
          timestamp: new Date(),
          type: 'chat',
        };

        setChatState(prev => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          isLoading: false,
        }));
      } else if (activeTab === 'sms') {
        if (!phoneNumber) {
          throw new Error('Please enter a phone number');
        }
        
        await smsService.sendSMS(phoneNumber, content);
        
        const smsMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `SMS sent to ${phoneNumber}`,
          role: 'assistant',
          timestamp: new Date(),
          type: 'sms',
        };

        setChatState(prev => ({
          ...prev,
          messages: [...prev.messages, smsMessage],
          isLoading: false,
        }));
      }
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  const clearChat = () => {
    setChatState({
      messages: [],
      isLoading: false,
      error: null,
    });
  };

  const dismissError = () => {
    setChatState(prev => ({
      ...prev,
      error: null,
    }));
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-header-content">
          <div>
            <h1>AI Assistant</h1>
            <p className="chat-header-subtitle">
              {activeTab === 'chat' ? 'Chat with ChatGPT' : 'Send SMS messages'}
            </p>
          </div>
        </div>
        <div className="chat-actions">
          <div className="tab-selector">
            <button
              className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <span>💬</span> Chat
            </button>
            <button
              className={`tab-button ${activeTab === 'sms' ? 'active' : ''}`}
              onClick={() => setActiveTab('sms')}
            >
              <span>📱</span> SMS
            </button>
          </div>
          <button className="clear-button" onClick={clearChat}>
            <span>🗑️</span> Clear
          </button>
        </div>
      </div>

      {activeTab === 'sms' && (
        <PhoneNumberInput
          phoneNumber={phoneNumber}
          onChange={setPhoneNumber}
        />
      )}

      <div className="messages-container">
        <div className="messages-list">
          {chatState.messages.length === 0 && !chatState.isLoading ? (
            <div className="messages-empty">
              <div className="messages-empty-icon">
                {activeTab === 'chat' ? '💭' : '📤'}
              </div>
              <h3>
                {activeTab === 'chat' ? 'Start a conversation' : 'Ready to send SMS'}
              </h3>
              <p>
                {activeTab === 'chat' 
                  ? 'Type a message below to start chatting with AI' 
                  : 'Enter a phone number and message to send SMS'}
              </p>
            </div>
          ) : (
            <>
              {chatState.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {chatState.isLoading && <LoadingSpinner />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {chatState.error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{chatState.error}</span>
          <button className="error-dismiss" onClick={dismissError}>
            ✕
          </button>
        </div>
      )}

      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={chatState.isLoading || (activeTab === 'sms' && !phoneNumber)}
        placeholder={
          activeTab === 'chat'
            ? 'Type your message...'
            : 'Type your SMS message...'
        }
      />
    </div>
  );
};

export default ChatInterface;
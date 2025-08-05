import React from 'react';
import type { Message } from '../types';
import './MessageBubble.css';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAvatarText = () => {
    return message.role === 'user' ? 'You' : 'AI';
  };

  const getTypeLabel = () => {
    return message.type === 'sms' ? 'SMS' : 'Chat';
  };

  return (
    <div 
      className={`message-bubble ${message.role}`}
      data-type={message.type}
    >
      <div className="message-header">
        <div className="message-avatar">
          {message.role === 'user' ? '👤' : '🤖'}
        </div>
        <div className="message-meta">
          <span className="message-type-badge">
            {getTypeLabel()}
          </span>
          <span className="message-time">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
      <div className="message-content">
        {message.content}
      </div>
    </div>
  );
};

export default MessageBubble;
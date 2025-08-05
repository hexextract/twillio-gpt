import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import './MessageInput.css';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your message...',
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getSendIcon = () => {
    if (disabled) return '⏳';
    return '➤';
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <div className="input-container">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="message-textarea"
          rows={1}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={`send-button ${disabled ? 'loading' : ''}`}
        >
          <span className="send-button-icon">
            {getSendIcon()}
          </span>
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
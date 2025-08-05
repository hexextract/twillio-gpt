import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-bubble thinking">
        <div className="loading-avatar">🤖</div>
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        <span className="loading-text">Thinking...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
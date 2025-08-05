import React from 'react';
import { config } from '../config/env';
import './ConfigStatus.css';

const ConfigStatus: React.FC = () => {
  const configItems = [
    {
      name: 'OpenAI API Key',
      key: 'VITE_OPENAI_API_KEY',
      value: config.openai.apiKey,
      required: true,
      description: 'Required for ChatGPT integration',
    },
    {
      name: 'Twilio Account SID',
      key: 'VITE_TWILIO_ACCOUNT_SID',
      value: config.twilio.accountSid,
      required: true,
      description: 'Required for SMS functionality',
    },
    {
      name: 'Twilio Auth Token',
      key: 'VITE_TWILIO_AUTH_TOKEN',
      value: config.twilio.authToken,
      required: true,
      description: 'Required for SMS functionality',
    },
    {
      name: 'Twilio Phone Number',
      key: 'VITE_TWILIO_PHONE_NUMBER',
      value: config.twilio.phoneNumber,
      required: true,
      description: 'Your Twilio phone number',
    },
  ];

  const missingRequired = configItems.filter(item => item.required && !item.value);
  const allConfigured = missingRequired.length === 0;

  if (allConfigured) {
    return null; // Don't show if everything is configured
  }

  const configuredCount = configItems.filter(item => item.value).length;
  const progressPercentage = (configuredCount / configItems.length) * 100;

  return (
    <div className="config-status">
      <div className="config-header">
        <h3>
          <span className="config-header-icon">⚙️</span>
          Configuration Required
        </h3>
        <p>Please configure the following environment variables in your <code>.env</code> file:</p>
      </div>

      <div className="config-progress">
        <div className="config-progress-bar">
          <div 
            className="config-progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="config-progress-text">
          {configuredCount} of {configItems.length} configured
        </div>
      </div>
      
      <div className="config-items">
        {configItems.map((item) => (
          <div key={item.key} className={`config-item ${item.value ? 'configured' : 'missing'}`}>
            <div className="config-item-header">
              <span className="config-status-icon">
                {item.value ? '✅' : '❌'}
              </span>
              <span className="config-name">{item.name}</span>
            </div>
            <div className="config-details">
              <code className="config-key">{item.key}</code>
              <span className="config-description">{item.description}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="config-instructions">
        <h4>
          <span className="config-instructions-icon">📋</span>
          Setup Instructions
        </h4>
        <ol>
          <li>Copy <code>.env.example</code> to <code>.env</code></li>
          <li>Fill in your API keys and credentials</li>
          <li>Restart the development server with <code>npm run dev</code></li>
        </ol>
        
        <div className="config-links">
          <p><strong>Get your API keys:</strong></p>
          <ul>
            <li>
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                <span className="config-link-icon">🔑</span>
                OpenAI API Keys
              </a>
            </li>
            <li>
              <a href="https://console.twilio.com/" target="_blank" rel="noopener noreferrer">
                <span className="config-link-icon">📞</span>
                Twilio Console
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConfigStatus;
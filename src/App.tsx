import { useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import ErrorBoundary from './components/ErrorBoundary';
import ConfigStatus from './components/ConfigStatus';
import { validateConfig } from './config/env';
import './App.css'

function App() {
  useEffect(() => {
    if (!validateConfig()) {
      console.warn('Please configure your environment variables in the .env file');
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="app">
        <ConfigStatus />
        <ChatInterface />
      </div>
    </ErrorBoundary>
  );
}

export default App

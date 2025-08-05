export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type: 'chat' | 'sms';
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface SmsState {
  phoneNumber: string;
  isLoading: boolean;
  error: string | null;
  lastSentMessage: string | null;
}
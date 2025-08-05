import OpenAI from 'openai';
import { config } from '../config/env';

class ChatService {
  private openai: OpenAI | null = null;

  constructor() {
    if (config.openai.apiKey) {
      this.openai = new OpenAI({
        apiKey: config.openai.apiKey,
        dangerouslyAllowBrowser: true,
      });
    }
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured. Please check your environment variables.');
    }

    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant. Provide clear, concise, and friendly responses.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        model: 'gpt-3.5-turbo',
        max_tokens: 150,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response received from ChatGPT');
      }

      return response;
    } catch (error) {
      console.error('ChatGPT API Error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          throw new Error('Invalid OpenAI API key. Please check your configuration.');
        }
        if (error.message.includes('429')) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (error.message.includes('network')) {
          throw new Error('Network error. Please check your connection.');
        }
        throw new Error(`ChatGPT Error: ${error.message}`);
      }
      
      throw new Error('An unexpected error occurred while communicating with ChatGPT');
    }
  }

  isConfigured(): boolean {
    return !!config.openai.apiKey;
  }
}

export const chatService = new ChatService();
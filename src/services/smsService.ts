import axios from 'axios';
import { config } from '../config/env';

class SmsService {
  private baseUrl = 'https://api.twilio.com/2010-04-01';

  async sendSMS(to: string, message: string): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Twilio credentials not configured. Please check your environment variables.');
    }

    const phoneNumber = this.formatPhoneNumber(to);
    
    try {
      const auth = btoa(`${config.twilio.accountSid}:${config.twilio.authToken}`);
      
      const response = await axios.post(
        `${this.baseUrl}/Accounts/${config.twilio.accountSid}/Messages.json`,
        new URLSearchParams({
          From: config.twilio.phoneNumber!,
          To: phoneNumber,
          Body: message,
        }),
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log('SMS sent successfully:', response.data.sid);
    } catch (error) {
      console.error('Twilio SMS Error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid Twilio credentials. Please check your Account SID and Auth Token.');
        }
        if (error.response?.status === 400) {
          const errorMessage = error.response.data?.message || 'Invalid request parameters';
          throw new Error(`Twilio Error: ${errorMessage}`);
        }
        if (error.response?.status === 403) {
          throw new Error('Twilio account suspended or insufficient permissions.');
        }
        
        throw new Error(`Twilio API Error: ${error.response?.data?.message || error.message}`);
      }
      
      throw new Error('Failed to send SMS. Please try again.');
    }
  }

  private formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    }
    
    if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    }
    
    throw new Error('Invalid phone number format. Please use (XXX) XXX-XXXX format.');
  }

  isConfigured(): boolean {
    return !!(
      config.twilio.accountSid &&
      config.twilio.authToken &&
      config.twilio.phoneNumber
    );
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'));
  }
}

export const smsService = new SmsService();
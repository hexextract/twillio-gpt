export const config = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  },
  twilio: {
    accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID,
    authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN,
    phoneNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER,
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'ChatGPT Twilio Integration',
  },
};

export const validateConfig = () => {
  const missingVars: string[] = [];
  
  if (!config.openai.apiKey) {
    missingVars.push('VITE_OPENAI_API_KEY');
  }
  
  if (!config.twilio.accountSid) {
    missingVars.push('VITE_TWILIO_ACCOUNT_SID');
  }
  
  if (!config.twilio.authToken) {
    missingVars.push('VITE_TWILIO_AUTH_TOKEN');
  }
  
  if (!config.twilio.phoneNumber) {
    missingVars.push('VITE_TWILIO_PHONE_NUMBER');
  }
  
  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars.join(', '));
    return false;
  }
  
  return true;
};
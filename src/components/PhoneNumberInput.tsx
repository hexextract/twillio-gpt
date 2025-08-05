import React from 'react';
import './PhoneNumberInput.css';

interface PhoneNumberInputProps {
  phoneNumber: string;
  onChange: (phoneNumber: string) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  phoneNumber,
  onChange,
}) => {
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
  };

  const getE164Format = () => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length === 10 ? `+1${cleaned}` : '';
  };

  const isValid = getE164Format() !== '';

  return (
    <div className="phone-input-container">
      <label htmlFor="phone-input" className="phone-label">
        <span className="phone-label-icon">📱</span>
        SMS Recipient
      </label>
      <div className="phone-input-wrapper">
        <input
          id="phone-input"
          type="tel"
          value={phoneNumber}
          onChange={handleChange}
          placeholder="(555) 123-4567"
          className="phone-input"
          maxLength={14}
          aria-invalid={phoneNumber && !isValid ? 'true' : 'false'}
        />
        {getE164Format() && (
          <div className="phone-format">
            <span className="phone-format-icon">✓</span>
            Ready to send to: {getE164Format()}
          </div>
        )}
        {phoneNumber && !isValid && (
          <div className="phone-validation invalid">
            <span className="phone-validation-icon">⚠️</span>
            Please enter a valid US phone number
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneNumberInput;
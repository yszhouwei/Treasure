import React from 'react';
import './Input.css';

export interface InputProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  type?: string;
  size?: 'small' | 'medium' | 'large';
}

const Input: React.FC<InputProps> = ({
  value = '',
  placeholder = '',
  disabled = false,
  onChange,
  type = 'text',
  size = 'medium',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <input
      className={`input input-${size} ${disabled ? 'disabled' : ''}`}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={handleChange}
      type={type}
    />
  );
};

export default Input;
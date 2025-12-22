import React from 'react';
import './RadioButton.css';

interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({ label, ...props }) => {
  return (
    <label className="radio-button-container">
      <input type="radio" className="radio-button-input" {...props} />
      {label && <span className="radio-button-label">{label}</span>}
    </label>
  );
};

export default RadioButton;

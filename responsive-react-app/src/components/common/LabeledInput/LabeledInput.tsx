import React from 'react';
import Input from '../Input/Input';
import './LabeledInput.css';

interface LabeledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const LabeledInput: React.FC<LabeledInputProps> = ({ label, ...props }) => {
  return (
    <div className="labeled-input">
      <label>{label}</label>
      <Input {...props} />
    </div>
  );
};

export default LabeledInput;

import React from 'react';
import './Checkbox.css';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  return (
    <label className="checkbox-container">
      <input type="checkbox" className="checkbox-input" {...props} />
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
};

export default Checkbox;

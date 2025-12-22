import React from 'react';
import './Spinner.css';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'medium', color = '#007bff' }) => {
  const spinnerStyle = {
    borderColor: color,
    borderTopColor: 'transparent',
  };

  return <div className={`spinner spinner-${size}`} style={spinnerStyle}></div>;
};

export default Spinner;

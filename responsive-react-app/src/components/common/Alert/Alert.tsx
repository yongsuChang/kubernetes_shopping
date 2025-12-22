import React, { useState } from 'react';
import './Alert.css';

interface AlertProps {
  message: string;
  variant?: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, variant = 'info', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`alert alert-${variant}`}>
      <p>{message}</p>
      {onClose && <button className="alert-close" onClick={handleClose}>&times;</button>}
    </div>
  );
};

export default Alert;

import React, { useState } from 'react';
import './Alert.css';

interface AlertProps {
  message?: string;
  children?: React.ReactNode;
  variant?: 'success' | 'error' | 'info' | 'warning' | 'danger';
  onClose?: () => void;
  style?: React.CSSProperties;
}

const Alert: React.FC<AlertProps> = ({ message, children, variant = 'info', onClose, style }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  const variantClass = variant === 'danger' ? 'error' : variant;

  return (
    <div className={`alert alert-${variantClass}`} style={style}>
      <div>{message || children}</div>
      {onClose && <button className="alert-close" onClick={handleClose}>&times;</button>}
    </div>
  );
};

export default Alert;

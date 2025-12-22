import React from 'react';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary' }) => {
  return (
    <span className={`badge badge-${variant}`}>
      {children}
    </span>
  );
};

export default Badge;

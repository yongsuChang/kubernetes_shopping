import React from 'react';
import './Container.css';

interface ContainerProps {
  children: React.ReactNode;
  fluid?: boolean; // If true, container will be 100% width
  maxWidth?: string; // e.g., '960px', '1200px'
}

const Container: React.FC<ContainerProps> = ({ children, fluid = false, maxWidth = '1200px' }) => {
  const containerStyle: React.CSSProperties = fluid ? { width: '100%' } : { maxWidth: maxWidth };

  return (
    <div className="container" style={containerStyle}>
      {children}
    </div>
  );
};

export default Container;

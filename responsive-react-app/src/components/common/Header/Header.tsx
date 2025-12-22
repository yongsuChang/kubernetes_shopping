import React from 'react';
import './Header.css';

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  return (
    <div className="custom-header">
      <h2>{title}</h2>
      {children && <div className="header-content">{children}</div>}
    </div>
  );
};

export default Header;

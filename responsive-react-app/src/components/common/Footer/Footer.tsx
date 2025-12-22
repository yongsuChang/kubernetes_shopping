import React from 'react';
import './Footer.css';

interface FooterProps {
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => {
  return (
    <footer className="custom-footer">
      {children ? children : <p>&copy; {new Date().getFullYear()} My Responsive App</p>}
    </footer>
  );
};

export default Footer;

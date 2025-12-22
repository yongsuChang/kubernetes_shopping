import React from 'react';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, footerContent }) => {
  return (
    <div className="layout">
      <header className="header">
        <h1>My Responsive App</h1>
      </header>
      <main className="main-content">
        {children}
      </main>
      {footerContent && footerContent}
    </div>
  );
};

export default Layout;

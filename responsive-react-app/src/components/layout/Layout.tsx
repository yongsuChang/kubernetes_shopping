import React from 'react';
import './Layout.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <h1>My Responsive App</h1>
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>© 2025 My Responsive App</p>
      </footer>
    </div>
  );
};

export default Layout;

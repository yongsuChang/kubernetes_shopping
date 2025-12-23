import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, footerContent }) => {
  const cartItemsCount = useCartStore((state) => state.items.length);

  return (
    <div className="layout">
      <header className="header">
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          <h1 style={{ margin: 0 }}>Shopping Mall</h1>
        </Link>
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white' }}>Home</Link>
          <Link to="/products" style={{ color: 'white' }}>Products</Link>
          <Link to="/cart" style={{ color: 'white', position: 'relative' }}>
            Cart
            {cartItemsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-10px',
                right: '-15px',
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '0.7rem'
              }}>
                {cartItemsCount}
              </span>
            )}
          </Link>
        </nav>
      </header>
      <main className="main-content">
        {children}
      </main>
      {footerContent && footerContent}
    </div>
  );
};

export default Layout;

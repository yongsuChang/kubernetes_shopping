import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../store/useCartStore';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, footerContent }) => {
  const { t, i18n } = useTranslation();
  const cartItemsCount = useCartStore((state) => state.items.length);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="layout">
      <header className="header">
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          <h1 style={{ margin: 0 }}>Shopping Mall</h1>
        </Link>
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px', marginRight: '20px' }}>
            <button 
              onClick={() => changeLanguage('ko')} 
              style={{ 
                background: 'none', 
                border: '1px solid white', 
                color: 'white', 
                cursor: 'pointer',
                fontSize: '0.8rem',
                padding: '2px 5px',
                opacity: i18n.language === 'ko' ? 1 : 0.6
              }}
            >KO</button>
            <button 
              onClick={() => changeLanguage('en')} 
              style={{ 
                background: 'none', 
                border: '1px solid white', 
                color: 'white', 
                cursor: 'pointer',
                fontSize: '0.8rem',
                padding: '2px 5px',
                opacity: i18n.language === 'en' ? 1 : 0.6
              }}
            >EN</button>
          </div>
          <Link to="/" style={{ color: 'white' }}>{t('common.home')}</Link>
          <Link to="/products" style={{ color: 'white' }}>{t('common.products')}</Link>
          <Link to="/cart" style={{ color: 'white', position: 'relative' }}>
            {t('common.cart')}
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

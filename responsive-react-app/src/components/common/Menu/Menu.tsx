import React, { useState } from 'react';
import './Menu.css';

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface MenuProps {
  items: MenuItem[];
  children: React.ReactNode; // The element that triggers the menu
}

const Menu: React.FC<MenuProps> = ({ items, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  return (
    <div className="menu-container">
      <div onClick={() => setIsOpen(!isOpen)}>
        {children}
      </div>
      {isOpen && (
        <ul className="menu-list">
          {items.map((item, index) => (
            <li key={index} className="menu-item" onClick={() => handleItemClick(item.onClick)}>
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Menu;

import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, links }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="sidebar-close" onClick={onClose}>&times;</button>
      <ul className="sidebar-links">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} onClick={onClose}>{link.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

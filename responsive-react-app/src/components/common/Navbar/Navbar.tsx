import React from 'react';
import './Navbar.css';

interface NavbarProps {
  title?: string;
  links: { label: string; href: string }[];
}

const Navbar: React.FC<NavbarProps> = ({ title = 'My App', links }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">{title}</div>
      <ul className="navbar-links">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;

import React, { useState } from 'react';
import './Accordion.css';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-item">
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <h3>{title}</h3>
        <span>{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <div className="accordion-content">
          {children}
        </div>
      )}
    </div>
  );
};

interface AccordionProps {
  children: React.ReactElement<AccordionItemProps>[];
}

const Accordion: React.FC<AccordionProps> = ({ children }) => {
  return <div className="accordion">{children}</div>;
};

export { Accordion, AccordionItem };

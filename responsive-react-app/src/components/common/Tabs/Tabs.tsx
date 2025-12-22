import React, { useState } from 'react';
import './Tabs.css';

interface TabProps {
  label: string;
  children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ children }) => {
  return <div className="tab-content">{children}</div>;
};

interface TabsProps {
  children: React.ReactElement<TabProps>[];
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(children[0]?.props.label || '');

  return (
    <div className="tabs">
      <ul className="tab-list">
        {children.map((child) => {
          const { label } = child.props;
          return (
            <li
              key={label}
              className={`tab-list-item ${activeTab === label ? 'tab-list-active' : ''}`}
              onClick={() => setActiveTab(label)}
            >
              {label}
            </li>
          );
        })}
      </ul>
      <div className="tab-content-container">
        {children.map((child) => {
          if (child.props.label === activeTab) {
            return child;
          }
          return null;
        })}
      </div>
    </div>
  );
};

export { Tabs, Tab };

import React, { useState } from 'react';
import './Dropdown.css';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  onSelect?: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);

  const handleSelect = (option: DropdownOption) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option.value);
    }
  };

  return (
    <div className="dropdown">
      <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
        {selectedOption ? selectedOption.label : 'Select an option'}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li key={option.value} onClick={() => handleSelect(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;

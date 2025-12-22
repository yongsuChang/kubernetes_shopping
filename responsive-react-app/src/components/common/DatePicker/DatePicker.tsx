import React from 'react';
import './DatePicker.css';

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Add any specific props if needed, otherwise just inherit
}

const DatePicker: React.FC<DatePickerProps> = ({ ...props }) => {
  return (
    <input type="date" className="date-picker" {...props} />
  );
};

export default DatePicker;

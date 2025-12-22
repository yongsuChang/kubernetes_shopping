import React from 'react';
import './DatePicker.css';

type DatePickerProps = React.InputHTMLAttributes<HTMLInputElement>;

const DatePicker: React.FC<DatePickerProps> = ({ ...props }) => {
  return (
    <input type="date" className="date-picker" {...props} />
  );
};

export default DatePicker;

import React from 'react';
import './Textarea.css';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea: React.FC<TextareaProps> = ({ ...props }) => {
  return (
    <textarea className="textarea" {...props} />
  );
};

export default Textarea;

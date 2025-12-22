import React from 'react';
import './Slider.css';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider: React.FC<SliderProps> = ({ min = 0, max = 100, step = 1, ...props }) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      className="slider"
      {...props}
    />
  );
};

export default Slider;

import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  progress: number; // 0 to 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
        {progress > 0 && <span className="progress-bar-text">{progress}%</span>}
      </div>
    </div>
  );
};

export default ProgressBar;

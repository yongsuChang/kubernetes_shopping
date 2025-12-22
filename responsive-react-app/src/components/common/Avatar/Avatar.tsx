import React from 'react';
import './Avatar.css';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'small' | 'medium' | 'large';
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = 'Avatar', initials, size = 'medium' }) => {
  if (src) {
    return <img src={src} alt={alt} className={`avatar avatar-${size}`} />;
  } else if (initials) {
    return (
      <div className={`avatar avatar-${size} avatar-initials`}>
        {initials.substring(0, 2).toUpperCase()}
      </div>
    );
  } else {
    // Fallback to a generic icon or empty avatar
    return (
      <div className={`avatar avatar-${size} avatar-fallback`}>
        {/* You could add an SVG icon here */}
      </div>
    );
  }
};

export default Avatar;

'use client';

import React, { useState } from 'react';

interface MagneticIconProps {
  children: React.ReactNode;
  className?: string;
}

export const MagneticIcon: React.FC<MagneticIconProps> = ({ children, className = '' }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Distance from the center of the icon
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Scale down the movement for a subtle, elegant magnetic pull (35% threshold)
    setCoords({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  return (
    <div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `translate3d(${coords.x}px, ${coords.y}px, 0) scale(1.1)`
          : 'none',
        transition: isHovered
          ? 'transform 0.08s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.2s var(--ease)'
          : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s var(--ease)',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};

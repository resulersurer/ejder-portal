'use client';

import React, { useState, useEffect } from 'react';
import { getGreeting } from '@/lib/utils';

interface TopbarProps {
  onMenuClick: () => void;
  modeLabel: string;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick, modeLabel }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <header className="topbar">
      <button className="tb-menu" onClick={onMenuClick}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <div className="tb-ctx">
        <div className="tb-greet">{greeting}</div>
        <div className="tb-title">Portal Yönetim Merkezi</div>
      </div>
      <div className="tb-right">
        <div className="mpill">
          <span className="mdot" />
          <span>{modeLabel}</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ViewMode } from '@/types/portal';
import { getGreeting } from '@/lib/utils';
import WeatherWidget from './WeatherWidget';
import ClockWidget from './ClockWidget';

interface TopbarProps {
  activeView?: ViewMode;
  onViewChange?: (view: ViewMode) => void;
  modeLabel?: string;
}

const Topbar: React.FC<TopbarProps> = ({ activeView = 'apps', onViewChange, modeLabel }) => {
  const [greeting, setGreeting] = useState('');
  const [logoFailed, setLogoFailed] = useState(false);

  // Live greeting
  useEffect(() => {
    setGreeting(getGreeting());
    const id = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    return () => clearInterval(id);
  }, []);

  const handleNavClick = (view: ViewMode) => {
    if (onViewChange) {
      onViewChange(view);
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        {/* Left: Logo + Brand / Greeting */}
        <div className="tb-left">
          <div className="tb-logo">
            {logoFailed ? (
              <span>E</span>
            ) : (
              <Image
                src="/assets/img/logo.png"
                alt="Ejder Turizm"
                width={48}
                height={48}
                onError={() => setLogoFailed(true)}
                priority
              />
            )}
          </div>
          <div className="tb-ctx">
            <div className="tb-greet">{greeting}</div>
            <div className="tb-title">Ejder Turizm Portal</div>
          </div>
        </div>

        {/* Center: Navigation Bar */}
        <nav className="tb-nav" aria-label="Ana Navigasyon">
          {/* Uygulamalar Tab */}
          <button
            type="button"
            className={`tb-nav-btn ${activeView === 'apps' ? 'active' : ''}`}
            onClick={() => handleNavClick('apps')}
            title="Uygulamalar"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="tb-nav-svg"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            <span>Uygulamalar</span>
          </button>

          {/* Web Siteleri Tab */}
          <button
            type="button"
            className={`tb-nav-btn ${activeView === 'websites' ? 'active' : ''}`}
            onClick={() => handleNavClick('websites')}
            title="Web Siteleri"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="tb-nav-svg"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>Web Siteleri</span>
          </button>

          <span className="tb-nav-sep" aria-hidden="true" />

          {/* Anasayfa (www.ejderturizm.com.tr) */}
          <a
            href="https://www.ejderturizm.com.tr"
            target="_blank"
            rel="noopener noreferrer"
            className="tb-nav-link"
            title="Ejder Turizm Ana Sayfası"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="tb-nav-svg"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Anasayfa</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="tb-nav-ext"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>

          {/* Backoffice (login.ejderturizm.com.tr) */}
          <a
            href="https://login.ejderturizm.com.tr"
            target="_blank"
            rel="noopener noreferrer"
            className="tb-nav-link"
            title="Ejder Turizm Backoffice Girişi"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="tb-nav-svg"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Backoffice</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="tb-nav-ext"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>

          {/* Tur Canlı Konum Takip (https://turtakipv2.vercel.app/) */}
          <a
            href="https://turtakipv2.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="tb-nav-link tb-nav-link-live"
            title="Tur Canlı Konum Takip Sistemi"
          >
            <span className="tb-live-pulse-dot" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="tb-nav-svg"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Tur Canlı Konum Takip</span>
            <span className="tb-live-badge">CANLI</span>
          </a>
        </nav>

        {/* Right: Weather + Clock Widgets */}
        <div className="tb-right">
          {/* Enhanced Weather Widget */}
          <WeatherWidget />

          {/* Enhanced Clock Widget */}
          <ClockWidget />

          {/* Mode / Admin indicator if on admin page */}
          {modeLabel && activeView === 'admin' && (
            <div className="mpill">
              <span className="mdot" />
              <span>{modeLabel}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ViewMode } from '@/types/portal';
import { MagneticIcon } from './MagneticIcon';

interface SidebarProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  isOpen,
  onClose,
}) => {
  const [logoFailed, setLogoFailed] = useState(false);

  const handleViewClick = (view: ViewMode) => {
    onViewChange(view);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`rail-ov ${isOpen ? 'on' : ''}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`rail ${isOpen ? 'open' : ''}`}>
        <div className="rail-top">
          <div className="rlogo">
            {logoFailed ? (
              <span className="rlogo-fb">E</span>
            ) : (
              <Image
                src="/assets/img/logo.png"
                alt="E"
                width={30}
                height={30}
                onError={() => setLogoFailed(true)}
              />
            )}
          </div>
          <div className="rb">
            <div className="rb-n">Ejder Turizm</div>
            <div className="rb-s">İç Portal Merkezi</div>
          </div>
        </div>

        <nav className="rail-nav">
          {/* Views Section */}
          <div className="rsec">
            <div className="rs">Görünüm</div>
            <button
              className={`ri ${activeView === 'apps' ? 'active' : ''}`}
              onClick={() => handleViewClick('apps')}
            >
              <MagneticIcon className="ri-ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="svg-sidebar-grid"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </MagneticIcon>
              <span className="rl">Uygulamalar</span>
              <span className="ri-meta">Hub</span>
            </button>
            <button
              className={`ri ${activeView === 'websites' ? 'active' : ''}`}
              onClick={() => handleViewClick('websites')}
            >
              <MagneticIcon className="ri-ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="svg-globe"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </MagneticIcon>
              <span className="rl">Web Siteleri</span>
              <span className="ri-meta">Web</span>
            </button>
            {activeView === 'admin' && (
              <button
                className={`ri ${activeView === 'admin' ? 'active' : ''}`}
                onClick={() => handleViewClick('admin')}
              >
                <MagneticIcon className="ri-ic">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="svg-gear"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </MagneticIcon>
                <span className="rl">Admin Paneli</span>
                <span className="ri-meta">Yönetim</span>
              </button>
            )}
          </div>

        </nav>

        <div className="rail-foot">
          <span className="rail-foot-dot" />
          <span>Portal erişimi hazır</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

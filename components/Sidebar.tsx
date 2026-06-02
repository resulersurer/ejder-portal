'use client';

import React, { useState, useEffect } from 'react';
import { ViewMode } from '@/types/portal';
import { defaultTeams } from '@/data/teams';

interface SidebarProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onTeamFilter: (team: string) => void;
  teams: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onTeamFilter, teams }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleViewClick = (view: ViewMode) => {
    onViewChange(view);
    setIsOpen(false);
  };

  const handleTeamClick = (team: string) => {
    onViewChange('apps');
    onTeamFilter(team);
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`rail-ov ${isOpen ? 'on' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`rail ${isOpen ? 'open' : ''}`}>
        <div className="rail-top">
          <div className="rlogo">
            <img
              src="/assets/img/logo.png"
              alt="E"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
                (img.parentElement as HTMLElement).innerHTML =
                  '<span class="rlogo-fb">E</span>';
              }}
            />
          </div>
          <div className="rb">
            <div className="rb-n">Ejder Turizm</div>
            <div className="rb-s">Portal Hub</div>
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
              <div className="ri-ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </div>
              <span className="rl">Uygulamalar</span>
            </button>
            <button
              className={`ri ${activeView === 'about' ? 'active' : ''}`}
              onClick={() => handleViewClick('about')}
            >
              <div className="ri-ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </div>
              <span className="rl">Hakkında</span>
            </button>
            <button
              className={`ri ${activeView === 'websites' ? 'active' : ''}`}
              onClick={() => handleViewClick('websites')}
            >
              <div className="ri-ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <span className="rl">Web Siteleri</span>
            </button>
            <button
              className={`ri ${activeView === 'admin' ? 'active' : ''}`}
              onClick={() => handleViewClick('admin')}
            >
              <div className="ri-ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <span className="rl">Admin Paneli</span>
            </button>
          </div>

          {/* Teams Section */}
          <div className="rsec">
            <div className="rs">Hızlı Erişim</div>
            {teams.map((team) => (
              <button
                key={team}
                className="ri"
                onClick={() => handleTeamClick(team)}
                title={team}
              >
                <div className="ri-ic">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="rl">{team}</span>
              </button>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

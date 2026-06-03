'use client';

import React, { useState, useEffect } from 'react';
import { Portal, Website, ViewMode } from '@/types/portal';
import { useRouter } from 'next/navigation';

// Components
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import AdminPanel from '@/components/AdminPanel';
import Toast, { showToast } from '@/components/Toast';

// Utils
import { SESSION_AUTH, ADMIN_PASSWORD } from '@/lib/utils';

interface AdminClientProps {
  initialPortals: Portal[];
  initialWebsites: Website[];
  initialTeams: string[];
}

export default function AdminClient({
  initialPortals,
  initialWebsites,
  initialTeams,
}: AdminClientProps) {
  const router = useRouter();
  const [portals, setPortals] = useState<Portal[]>(initialPortals);
  const [websites, setWebsites] = useState<Website[]>(initialWebsites);
  const [teams, setTeams] = useState<string[]>(initialTeams);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync state if initial props change
  useEffect(() => {
    setPortals(initialPortals);
  }, [initialPortals]);

  useEffect(() => {
    setWebsites(initialWebsites);
  }, [initialWebsites]);

  useEffect(() => {
    setTeams(initialTeams);
  }, [initialTeams]);

  // Check authentication status in session storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem(SESSION_AUTH);
      if (auth === '1') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem(SESSION_AUTH, '1');
      setAdminPassword('');
      showToast('Admin paneline hoş geldiniz', 'success');
    } else {
      showToast('Hatalı şifre. Tekrar deneyin.', 'error');
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(SESSION_AUTH);
    showToast('Çıkış yapıldı', 'success');
    router.push('/');
  };

  const handleViewChange = (view: ViewMode) => {
    if (view === 'apps') {
      router.push('/');
    } else if (view === 'websites') {
      router.push('/?view=websites');
    }
  };

  const handleTeamFilter = (team: string) => {
    router.push(`/?team=${encodeURIComponent(team)}`);
  };

  const handleUpdate = (
    updatedPortals: Portal[],
    updatedWebsites: Website[],
    updatedTeams: string[]
  ) => {
    setPortals(updatedPortals);
    setWebsites(updatedWebsites);
    setTeams(updatedTeams);
  };

  return (
    <div className="ws">
      {/* Sidebar */}
      <Sidebar
        activeView="admin"
        onViewChange={handleViewChange}
        onTeamFilter={handleTeamFilter}
        teams={teams}
      />

      {/* Main Content */}
      <div className="wb">
        {/* Topbar */}
        <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} modeLabel="Admin Paneli" />

        {/* Main Content Area */}
        <main className="main" style={{ minHeight: 'calc(100vh - var(--bar))', position: 'relative' }}>
          {/* Admin Login Overlay */}
          {!isAuthenticated ? (
            <div className="alov open" id="adminLoginOverlay">
              <div className="albox">
                <div className="alic">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="alt">Admin Girişi</div>
                <div className="als">Yönetim paneline erişmek için şifreyi girin</div>
                <div className="fg">
                  <label className="fl">Şifre</label>
                  <input
                    type="password"
                    className="fi"
                    placeholder="Şifreyi girin…"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                  />
                </div>
                <button className="btn btn-p btn-full" onClick={handleAdminLogin} style={{ marginTop: '10px' }}>
                  Giriş Yap
                </button>
                <button
                  className="btn btn-s btn-full"
                  onClick={() => router.push('/')}
                  style={{ marginTop: '7px' }}
                >
                  İptal
                </button>
              </div>
            </div>
          ) : (
            <AdminPanel
              portals={portals}
              websites={websites}
              teams={teams}
              isAuthenticated={isAuthenticated}
              onLogout={handleAdminLogout}
              onUpdate={handleUpdate}
            />
          )}
        </main>
      </div>

      {/* Toast */}
      <Toast />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Portal, Website, ViewMode } from '@/types/portal';

// Components
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import SearchDock from '@/components/SearchDock';
import PortalCard from '@/components/PortalCard';
import WebsiteCard from '@/components/WebsiteCard';
import AdminPanel from '@/components/AdminPanel';
import Toast, { showToast } from '@/components/Toast';
import PdfViewer from '@/components/PdfViewer';

// Utils
import { SESSION_AUTH, ADMIN_PASSWORD } from '@/lib/utils';

interface PortalClientProps {
  initialPortals: Portal[];
  initialWebsites: Website[];
  initialTeams: string[];
}

export default function PortalClient({
  initialPortals,
  initialWebsites,
  initialTeams,
}: PortalClientProps) {
  const [currentView, setCurrentView] = useState<ViewMode>('apps');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [portals, setPortals] = useState<Portal[]>(initialPortals);
  const [websites, setWebsites] = useState<Website[]>(initialWebsites);
  const [teams, setTeams] = useState<string[]>(initialTeams);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [currentPdfPortal, setCurrentPdfPortal] = useState<Portal | null>(null);
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

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
    setCurrentFilter('all');
    setSearchTerm('');
    setSidebarOpen(false);
  };

  const handleTeamFilter = (team: string) => {
    setCurrentFilter(team);
    setCurrentView('apps');
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase().trim());
  };

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
    setCurrentView('apps');
    showToast('Çıkış yapıldı', 'success');
  };

  const handleOpenPdf = (portalId: string) => {
    const portal = portals.find((p) => p.id === portalId);
    if (portal && portal.trainingPdf) {
      setCurrentPdfPortal(portal);
      setPdfViewerOpen(true);
    }
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

  // Filter portals based on search and team filter
  const filteredPortals = portals.filter((p) => {
    if (currentFilter !== 'all' && !p.teams.includes(currentFilter)) return false;
    if (!searchTerm) return true;
    return [p.code, p.name, p.url, p.portalType, p.about || '', ...p.teams]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm);
  });

  const viewLabels = {
    apps: 'Uygulamalar',
    about: 'Hakkında',
    websites: 'Web Siteleri',
    admin: 'Admin Paneli',
  };

  const viewTitles = {
    apps: 'Uygulamalar',
    about: 'Portal Bilgileri',
    websites: 'Web Siteleri',
    admin: 'Admin Paneli',
  };

  const viewSubs = {
    apps: 'Tüm sistemlerinize tek noktadan erişin',
    about: 'Her portal hakkında detaylı bilgi',
    websites: 'Kurumsal web sitelerimiz',
    admin: 'Portal, web sitesi ve ekipleri yönetin',
  };

  return (
    <div className="ws">
      {/* Sidebar */}
      <Sidebar
        activeView={currentView}
        onViewChange={handleViewChange}
        onTeamFilter={handleTeamFilter}
        teams={teams}
      />

      {/* Main Content */}
      <div className="wb">
        {/* Topbar */}
        <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} modeLabel={viewLabels[currentView]} />

        {/* Main Content Area */}
        <main className="main">
          {/* Admin Login Overlay */}
          {!isAuthenticated && currentView === 'admin' && (
            <div
              className={`alov ${currentView === 'admin' && !isAuthenticated ? 'open' : ''}`}
              id="adminLoginOverlay"
            >
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
                  onClick={() => {
                    handleViewChange('apps');
                  }}
                  style={{ marginTop: '7px' }}
                >
                  İptal
                </button>
              </div>
            </div>
          )}

          {/* Overview Section */}
          {['apps', 'about', 'websites'].includes(currentView) && (
            <div className="ov">
              <div>
                <div className="ov-title">{viewTitles[currentView]}</div>
                <div className="ov-sub">{viewSubs[currentView]}</div>
              </div>
              {currentView !== 'admin' && (
                <div className="ov-stats">
                  <div className="ostat">
                    <span className="ostat-v">{currentView === 'websites' ? websites.length : filteredPortals.length}</span>
                    <span className="ostat-l">{currentView === 'websites' ? 'Site' : 'Sistem'}</span>
                  </div>
                  <div className="ostat">
                    <span className="ostat-v">{teams.length}</span>
                    <span className="ostat-l">Ekip</span>
                  </div>
                  <div className="ostat">
                    <span className="ostat-v">
                      {currentView === 'websites'
                        ? websites.length
                        : filteredPortals.filter((p) => (p.users || 0) > 0).length}
                    </span>
                    <span className="ostat-l">Aktif</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search Dock */}
          <SearchDock visible={['apps', 'about'].includes(currentView)} onSearch={handleSearch} />

          {/* Apps/About View */}
          {['apps', 'about'].includes(currentView) && (
            <div id="appsView">
              <div className="shd">
                <div className="shd-t">
                  {currentView === 'about' ? 'Portal Bilgileri' : 'Tüm Uygulamalar'}
                </div>
                <div className="shd-l" />
                <div className="shd-b">{filteredPortals.length} portal</div>
              </div>
              <div className="gw">
                {filteredPortals.length > 0 ? (
                  <div className="ag">
                    {filteredPortals.map((portal, index) => (
                      <div
                        key={portal.id}
                        style={{
                          animationDelay: `${index * 30}ms`,
                        }}
                      >
                        <PortalCard
                          portal={portal}
                          isAbout={currentView === 'about'}
                          onOpenPdf={handleOpenPdf}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty">
                    <div className="emp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                    </div>
                    <div className="emp-t">Portal bulunamadı</div>
                    <div className="emp-s">Farklı bir arama veya filtre deneyin.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Websites View */}
          {currentView === 'websites' && (
            <div id="websitesView">
              <div className="shd">
                <div className="shd-t">Web Siteleri</div>
                <div className="shd-l" />
                <div className="shd-b">{websites.length} Site</div>
              </div>
              <div className="gw">
                {websites.length > 0 ? (
                  <div className="wg">
                    {websites.map((website) => (
                      <WebsiteCard key={website.id} website={website} />
                    ))}
                  </div>
                ) : (
                  <div className="empty" style={{ gridColumn: '1 / -1' }}>
                    <div className="emp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20" />
                      </svg>
                    </div>
                    <div className="emp-t">Web sitesi bulunamadı</div>
                    <div className="emp-s">Henüz eklenmiş bir web sitesi yok.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Admin View */}
          {currentView === 'admin' && (
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

      {/* PDF Viewer */}
      <PdfViewer
        isOpen={pdfViewerOpen}
        portalName={currentPdfPortal?.name || ''}
        pdfUrl={currentPdfPortal?.trainingPdf || ''}
        onClose={() => setPdfViewerOpen(false)}
      />

      {/* Toast */}
      <Toast />
    </div>
  );
}

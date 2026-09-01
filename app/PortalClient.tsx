'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Portal, Website, ViewMode } from '@/types/portal';

// Components
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
  const [portalTypeFilter, setPortalTypeFilter] = useState<'all' | 'Private' | 'Public' | 'Restricted'>('all');
  const [pdfOnly, setPdfOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favoritePortalIds, setFavoritePortalIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [portals, setPortals] = useState<Portal[]>(initialPortals);
  const [websites, setWebsites] = useState<Website[]>(initialWebsites);
  const [teams, setTeams] = useState<string[]>(initialTeams);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [currentPdfPortal, setCurrentPdfPortal] = useState<Portal | null>(null);

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

  // Check authentication status in session storage and parse query parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem(SESSION_AUTH);
      if (auth === '1') {
        setIsAuthenticated(true);
      }

      const favorites = localStorage.getItem('ej_favorite_portals');
      if (favorites) {
        try {
          setFavoritePortalIds(JSON.parse(favorites));
        } catch {
          setFavoritePortalIds([]);
        }
      }

      // Parse query parameters
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      const teamParam = params.get('team');
      if (viewParam === 'websites') {
        setCurrentView('websites');
      } else if (teamParam) {
        setCurrentFilter(teamParam);
        setCurrentView('apps');
      }
    }
  }, []);

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
    setCurrentFilter('all');
    setPortalTypeFilter('all');
    setPdfOnly(false);
    setFavoritesOnly(false);
    setSearchTerm('');
  };

  const handleClearFilters = () => {
    setCurrentFilter('all');
    setPortalTypeFilter('all');
    setPdfOnly(false);
    setFavoritesOnly(false);
  };

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term.toLowerCase().trim());
  }, []);

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

  const toggleFavorite = (portalId: string) => {
    setFavoritePortalIds((current) => {
      const next = current.includes(portalId)
        ? current.filter((id) => id !== portalId)
        : [...current, portalId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('ej_favorite_portals', JSON.stringify(next));
      }
      return next;
    });
  };

  // Filter portals based on search and team filter
  const filteredPortals = portals.filter((p) => {
    if (currentFilter !== 'all' && !p.teams.includes(currentFilter)) return false;
    if (portalTypeFilter !== 'all' && p.portalType !== portalTypeFilter) return false;
    if (pdfOnly && !p.trainingPdf) return false;
    if (favoritesOnly && !favoritePortalIds.includes(p.id)) return false;
    if (!searchTerm) return true;
    return [p.code, p.name, p.url, p.portalType, p.about || '', ...p.teams]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm);
  });

  const viewLabels = {
    apps: 'Uygulamalar',
    websites: 'Web Siteleri',
    admin: 'Admin Paneli',
  };

  const viewTitles = {
    apps: 'Uygulamalar',
    websites: 'Web Siteleri',
    admin: 'Admin Paneli',
  };

  const viewSubs = {
    apps: 'Tüm sistemlerinize tek noktadan erişin',
    websites: 'Kurumsal web sitelerimiz',
    admin: 'Portal, web sitesi ve ekipleri yönetin',
  };

  return (
    <div className="ws ws-no-sidebar">
      {/* Main Content */}
      <div className="wb">
        {/* Topbar */}
        <Topbar
          activeView={currentView}
          onViewChange={handleViewChange}
          modeLabel={viewLabels[currentView]}
        />

        {/* Main Content Area */}
        <main className="main">
          {/* Overview Section */}
          {['apps', 'websites'].includes(currentView) && (
            <div className="ov">
              <div>
                <div className="ov-title">{viewTitles[currentView]}</div>
                <div className="ov-sub">{viewSubs[currentView]}</div>
              </div>
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
            </div>
          )}

          {/* Search Dock */}
          <SearchDock visible={currentView === 'apps'} onSearch={handleSearch} />

          {/* Apps View */}
          {currentView === 'apps' && (
            <div id="appsView">
              <div className="filters">
                <button
                  className={`filter-chip ${currentFilter === 'all' && portalTypeFilter === 'all' && !pdfOnly && !favoritesOnly ? 'active' : ''}`}
                  onClick={handleClearFilters}
                >
                  Tümü
                </button>
                <button
                  className={`filter-chip ${favoritesOnly ? 'active' : ''}`}
                  onClick={() => setFavoritesOnly((value) => !value)}
                >
                  Favoriler
                </button>
                <button
                  className={`filter-chip ${portalTypeFilter === 'Private' ? 'active' : ''}`}
                  onClick={() => setPortalTypeFilter((value) => (value === 'Private' ? 'all' : 'Private'))}
                >
                  Private
                </button>
                <button
                  className={`filter-chip ${portalTypeFilter === 'Public' ? 'active' : ''}`}
                  onClick={() => setPortalTypeFilter((value) => (value === 'Public' ? 'all' : 'Public'))}
                >
                  Public
                </button>
                <button
                  className={`filter-chip ${portalTypeFilter === 'Restricted' ? 'active' : ''}`}
                  onClick={() => setPortalTypeFilter((value) => (value === 'Restricted' ? 'all' : 'Restricted'))}
                >
                  Restricted
                </button>
                <button
                  className={`filter-chip ${pdfOnly ? 'active' : ''}`}
                  onClick={() => setPdfOnly((value) => !value)}
                >
                  Eğitim PDF
                </button>
                {currentFilter !== 'all' && (
                  <button className="filter-chip active" onClick={() => setCurrentFilter('all')}>
                    {currentFilter}
                  </button>
                )}
              </div>
              <div className="shd">
                <div className="shd-t">Tüm Uygulamalar</div>
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
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                        }}
                      >
                        <PortalCard
                          portal={portal}
                          isAbout={false}
                          onOpenPdf={handleOpenPdf}
                          isFavorite={favoritePortalIds.includes(portal.id)}
                          onToggleFavorite={toggleFavorite}
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
                  <div className="ag">
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

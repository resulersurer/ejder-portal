'use client';

import React, { useState, useRef } from 'react';
import { Portal } from '@/types/portal';
import { getIconClass, getPortalIcon } from '@/lib/utils';
import { MagneticIcon } from './MagneticIcon';
import { showToast } from './Toast';

interface PortalCardProps {
  portal: Portal;
  isAbout?: boolean;
  onOpenPdf?: (portalId: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (portalId: string) => void;
}

const PortalCard: React.FC<PortalCardProps> = ({
  portal,
  isAbout = false,
  onOpenPdf,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const cardRef = useRef<HTMLDivElement>(null);

  const iconClass = getIconClass(portal);

  // 3D Parallax Tilt & Cursor Lighting
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
    const rotateY = ((x - centerX) / centerX) * 6;

    const mouseXPercent = Math.round((x / rect.width) * 100);
    const mouseYPercent = Math.round((y / rect.height) * 100);

    setTiltStyle({
      transform: `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`,
      backgroundImage: `radial-gradient(circle at ${mouseXPercent}% ${mouseYPercent}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 65%)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)',
      backgroundImage: 'none',
    });
  };

  // Copy Link Handler
  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(portal.url);
      setCopied(true);
      showToast(`${portal.name} bağlantısı panoya kopyalandı!`, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // QR Code Handler
  const handleToggleQr = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQr(!showQr);
    setShowInfo(false);
  };

  // Info Handler
  const handleToggleInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInfo(!showInfo);
    setShowQr(false);
  };

  // PDF Handler
  const handlePdfClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (portal.trainingPdf && onOpenPdf) {
      onOpenPdf(portal.id);
    }
  };

  const PeopleSvg = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ width: '12px', height: '12px' }}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );

  const UserSvg = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ width: '12px', height: '12px' }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  // Security icons for Portal Type
  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'private':
        return (
          <span className="type-badge private" title="Özel Kurumsal Sistem">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="badge-svg">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Private
          </span>
        );
      case 'restricted':
        return (
          <span className="type-badge restricted" title="Kısıtlı / Yetkili Erişim">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="badge-svg">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Restricted
          </span>
        );
      default:
        return (
          <span className="type-badge public" title="Genel Portal Erişimi">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="badge-svg">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            Public
          </span>
        );
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(portal.url)}`;

  return (
    <div
      className="card-wrap tech-card-wrap"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top Action Dock (Favorite + QR + Info + Copy) */}
      <div className="card-top-actions">
        {/* Copy Link Button */}
        <button
          type="button"
          className={`card-act-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopyLink}
          title={copied ? 'Kopyalandı!' : 'Bağlantıyı Kopyala'}
          aria-label="Bağlantıyı kopyala"
        >
          {copied ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="act-svg-done">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="act-svg">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>

        {/* QR Code Button */}
        <button
          type="button"
          className={`card-act-btn ${showQr ? 'active' : ''}`}
          onClick={handleToggleQr}
          title="Mobil Giriş QR Kodu"
          aria-label="QR Kodunu Göster"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="act-svg">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </button>

        {/* Info / About Button */}
        {portal.about?.trim() && (
          <button
            type="button"
            className={`card-act-btn ${showInfo ? 'active' : ''}`}
            onClick={handleToggleInfo}
            title="Sistem Detayları & Bilgi"
            aria-label="Detayları göster"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="act-svg">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </button>
        )}

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            type="button"
            className={`card-act-btn fav-act-btn ${isFavorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(portal.id)}
            aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            title={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          >
            <svg
              viewBox="0 0 24 24"
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        )}
      </div>

      {/* Main Interactive Card */}
      <a
        href={portal.url}
        className="card tech-card"
        data-accent={iconClass}
        target="_blank"
        rel="noopener noreferrer"
        style={tiltStyle}
      >
        <div>
          {/* Card Top: Icon + Status Dot + Badges */}
          <div className="ctop">
            <div className="ci-wrapper">
              <MagneticIcon className={`ci ${iconClass}`}>
                {getPortalIcon(portal)}
              </MagneticIcon>
              <span className="card-live-dot" title="Sistem Çevrimiçi & Aktif" />
            </div>

            <div className="card-badges">
              {getTypeBadge(portal.portalType)}
              {portal.trainingPdf && (
                <button
                  type="button"
                  className="pdf-chip-btn"
                  onClick={handlePdfClick}
                  title="Eğitim PDF Dokümanını Aç"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pdf-chip-svg">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  PDF
                </button>
              )}
            </div>
          </div>

          {/* Card Body: Title & URL */}
          <div className="cb">
            <div className="ct">{portal.name}</div>
            <div className="cu">
              <span>{portal.url.replace(/^https?:\/\//, '')}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="cu-ext-svg">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card Foot: Team Telemetry & User Count */}
        <div className="cfoot">
          <div className="cfoot-teams">
            <span className="cm">
              {PeopleSvg}
              {portal.teams.length} ekip
            </span>
            {portal.users > 0 && (
              <span className="cm">
                {UserSvg}
                {portal.users} aktif
              </span>
            )}
          </div>

          {/* Primary team chip preview */}
          {portal.teams[0] && (
            <span className="primary-team-tag">{portal.teams[0]}</span>
          )}
        </div>
      </a>

      {/* QR Code Modal Flyout */}
      {showQr && (
        <div className="card-pop-flyout" onClick={(e) => e.stopPropagation()}>
          <div className="cpf-head">
            <span>Mobil QR Girişi</span>
            <button type="button" className="cpf-close" onClick={() => setShowQr(false)}>✕</button>
          </div>
          <div className="cpf-qr-box">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrImageUrl} alt={`${portal.name} QR Kodu`} width={130} height={130} />
          </div>
          <div className="cpf-hint">Kamera ile tarayıp mobilde açın</div>
        </div>
      )}

      {/* Info Modal Flyout */}
      {showInfo && (
        <div className="card-pop-flyout" onClick={(e) => e.stopPropagation()}>
          <div className="cpf-head">
            <span>{portal.name}</span>
            <button type="button" className="cpf-close" onClick={() => setShowInfo(false)}>✕</button>
          </div>
          <div className="cpf-desc">{portal.about}</div>
          <div className="cpf-teams-wrap">
            <div className="cpf-teams-lbl">Erişebilen Ekipler:</div>
            <div className="cpf-chips">
              {portal.teams.map((t) => (
                <span key={t} className="cpf-team-chip">{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalCard;

'use client';

import React, { useState, useRef } from 'react';
import { Website } from '@/types/portal';
import { MagneticIcon } from './MagneticIcon';
import { showToast } from './Toast';

interface WebsiteCardProps {
  website: Website;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ website }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Parallax Tilt & Cursor Lighting
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    const mouseXPercent = Math.round((x / rect.width) * 100);
    const mouseYPercent = Math.round((y / rect.height) * 100);

    setTiltStyle({
      transform: `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`,
      backgroundImage: `radial-gradient(circle at ${mouseXPercent}% ${mouseYPercent}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255) 65%)`,
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
      navigator.clipboard.writeText(website.url);
      setCopied(true);
      showToast(`${website.name} bağlantısı kopyalandı!`, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // QR Code Handler
  const handleToggleQr = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQr(!showQr);
  };

  const WebIcon = (
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
  );

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(website.url)}`;

  return (
    <div
      className="card-wrap tech-card-wrap"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top Action Dock */}
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
      </div>

      {/* Main Interactive Card */}
      <a
        href={website.url}
        className="card tech-card"
        data-accent="c-emerald"
        target="_blank"
        rel="noopener noreferrer"
        style={tiltStyle}
      >
        <div>
          <div className="ctop">
            <div className="ci-wrapper">
              <MagneticIcon className="ci c-emerald">{WebIcon}</MagneticIcon>
              <span className="card-live-dot" title="Web Sitesi Yayında & Aktif" />
            </div>

            <div className="card-badges">
              <span className="type-badge public">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="badge-svg">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                </svg>
                Canlı Web
              </span>
            </div>
          </div>

          <div className="cb">
            <div className="ct">{website.name}</div>
            <div className="cu">
              <span>{website.url.replace(/^https?:\/\//, '')}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="cu-ext-svg">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </div>
          </div>
        </div>

        <div className="cfoot">
          <span className="cm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px' }}>
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            Kurumsal Web Sitesi
          </span>
          <span className="primary-team-tag">Online</span>
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
            <img src={qrImageUrl} alt={`${website.name} QR Kodu`} width={130} height={130} />
          </div>
          <div className="cpf-hint">Kamera ile tarayıp mobilde açın</div>
        </div>
      )}
    </div>
  );
};

export default WebsiteCard;

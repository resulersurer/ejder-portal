'use client';

import React from 'react';
import { Portal } from '@/types/portal';
import { getIconClass, getPortalIcon } from '@/lib/utils';
import { MagneticIcon } from './MagneticIcon';

interface PortalCardProps {
  portal: Portal;
  isAbout?: boolean;
  onOpenPdf?: (portalId: string) => void;
}

const PortalCard: React.FC<PortalCardProps> = ({ portal, isAbout = false, onOpenPdf }) => {
  const iconClass = getIconClass(portal);

  const PeopleSvg = (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      style={{ width: '11px', height: '11px' }}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );

  const UserSvg = (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      style={{ width: '11px', height: '11px' }}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  if (isAbout) {
    const PdfSvg = (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: '14px', height: '14px', flexShrink: 0 }}
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    );

    const pdfBtn = portal.trainingPdf ? (
      <button
        className="btn-shine"
        onClick={() => onOpenPdf?.(portal.id)}
        style={{
          marginTop: '10px',
          width: '100%',
          justifyContent: 'center',
          gap: '7px',
          fontSize: '13px',
          fontWeight: '700',
          padding: '11px 16px',
          background: 'var(--brand)',
          color: '#fff',
          borderRadius: '8px',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          fontFamily: 'inherit',
          letterSpacing: '-0.1px',
          boxShadow: '0 4px 15px rgba(190,55,40,.3)',
          transition: 'transform 0.2s var(--ease), box-shadow 0.2s var(--ease)',
        }}
        onMouseOver={(e) => {
          const target = e.currentTarget;
          target.style.transform = 'translateY(-1px)';
          target.style.boxShadow = '0 6px 20px rgba(190,55,40,.4)';
        }}
        onMouseOut={(e) => {
          const target = e.currentTarget;
          target.style.transform = 'none';
          target.style.boxShadow = '0 4px 15px rgba(190,55,40,.3)';
        }}
      >
        {PdfSvg}
        Eğitim PDF
      </button>
    ) : (
      <button
        disabled
        style={{
          marginTop: '10px',
          width: '100%',
          justifyContent: 'center',
          gap: '7px',
          fontSize: '12.5px',
          fontWeight: '600',
          padding: '11px 16px',
          background: 'transparent',
          color: 'var(--t3)',
          borderRadius: '8px',
          border: '1px solid var(--l1)',
          display: 'flex',
          alignItems: 'center',
          cursor: 'not-allowed',
          fontFamily: 'inherit',
        }}
      >
        {PdfSvg}
        Eğitim PDF Eklenmedi
      </button>
    );

    return (
      <div className="card ac">
        <div>
          <div className="ctop">
            <MagneticIcon className={`ci ${iconClass}`}>
              {getPortalIcon(portal)}
            </MagneticIcon>
          </div>
          <div className="cb">
            <div className="ct">{portal.name}</div>
          </div>
          {portal.about?.trim() && <div className="cdesc">{portal.about}</div>}
        </div>
        {pdfBtn}
      </div>
    );
  }

  return (
    <a
      href={portal.url}
      className="card"
      data-accent={iconClass}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div>
        <div className="ctop">
          <MagneticIcon className={`ci ${iconClass}`}>
            {getPortalIcon(portal)}
          </MagneticIcon>
        </div>
        <div className="cb">
          <div className="ct">{portal.name}</div>
          <div className="cu">{portal.url.replace('https://', '')}</div>
        </div>
      </div>
      <div className="cfoot">
        <span className="cm">
          {PeopleSvg}
          {portal.teams.length} ekip
        </span>
        {portal.users > 0 && (
          <span className="cm">
            {UserSvg}
            {portal.users} kullanıcı
          </span>
        )}
      </div>
    </a>
  );
};

export default PortalCard;

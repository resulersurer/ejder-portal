'use client';

import React from 'react';
import { Website } from '@/types/portal';

interface WebsiteCardProps {
  website: Website;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ website }) => {
  const WebIcon = (
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
  );

  return (
    <a
      href={website.url}
      className="card"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="ctop">
        <div className="ci c-emerald">{WebIcon}</div>
      </div>
      <div className="cb">
        <div className="ct">{website.name}</div>
        <div className="cu">{website.url.replace(/^https?:\/\//, '')}</div>
      </div>
      {website.about?.trim() && (
        <div className="cdesc">
          {website.about.substring(0, 120)}
          {website.about.length > 120 ? '…' : ''}
        </div>
      )}
      <div className="cfoot">
        <span className="cm">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          Web Sitesi
        </span>
      </div>
    </a>
  );
};

export default WebsiteCard;

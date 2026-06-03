import React from 'react';
import { Portal } from '@/types/portal';

export const ADMIN_PASSWORD = 'ejder2024';
export const LS_PORTALS = 'ej_portals';
export const LS_WEBSITES = 'ej_websites';
export const LS_TEAMS = 'ej_teams';
export const SESSION_AUTH = 'ej_auth';

export function getPortalIcon(portal: Portal): React.ReactNode {
  const name = (portal.name || '').toLowerCase();
  const code = (portal.code || '').toUpperCase();

  // Clean SVG Helper props
  const props = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const iconMap: Record<string, React.ReactNode> = {
    'analytic': (
      <svg {...props}>
        <line x1="18" y1="20" x2="18" y2="10" className="svg-bar-3" />
        <line x1="12" y1="20" x2="12" y2="4" className="svg-bar-2" />
        <line x1="6" y1="20" x2="6" y2="14" className="svg-bar-1" />
        <path d="M2 20h20" />
      </svg>
    ),
    'zanl': (
      <svg {...props}>
        <line x1="18" y1="20" x2="18" y2="10" className="svg-bar-3" />
        <line x1="12" y1="20" x2="12" y2="4" className="svg-bar-2" />
        <line x1="6" y1="20" x2="6" y2="14" className="svg-bar-1" />
        <path d="M2 20h20" />
      </svg>
    ),
    'crm': (
      <svg {...props}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" className="svg-user-body" />
        <circle cx="12" cy="7" r="4" className="svg-user-head" />
      </svg>
    ),
    'zcrm': (
      <svg {...props}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" className="svg-user-body" />
        <circle cx="12" cy="7" r="4" className="svg-user-head" />
      </svg>
    ),
    'mail': (
      <svg {...props}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" className="svg-envelope-body" />
        <polyline points="22,6 12,13 2,6" className="svg-envelope-flap" />
      </svg>
    ),
    'e-posta': (
      <svg {...props}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" className="svg-envelope-body" />
        <polyline points="22,6 12,13 2,6" className="svg-envelope-flap" />
      </svg>
    ),
    'project': (
      <svg {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" className="svg-board-bg" />
        <path d="M3 9h18M9 21V9" className="svg-board-lines" />
      </svg>
    ),
    'proje': (
      <svg {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" className="svg-board-bg" />
        <path d="M3 9h18M9 21V9" className="svg-board-lines" />
      </svg>
    ),
    'workdrive': (
      <svg {...props}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" className="svg-folder" />
      </svg>
    ),
    'drive': (
      <svg {...props}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" className="svg-folder" />
      </svg>
    ),
    'dosya': (
      <svg {...props}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" className="svg-folder" />
      </svg>
    ),
    'flow': (
      <svg {...props}>
        <polyline points="17 1 21 5 17 9" className="svg-arrow-right" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4" className="svg-arrow-left" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" className="svg-flow-loop" />
      </svg>
    ),
    'otomasyon': (
      <svg {...props}>
        <polyline points="17 1 21 5 17 9" className="svg-arrow-right" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4" className="svg-arrow-left" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" className="svg-flow-loop" />
      </svg>
    ),
    'form': (
      <svg {...props}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" className="svg-form-body" />
        <polyline points="14 2 14 8 20 8" className="svg-form-fold" />
        <line x1="16" y1="13" x2="8" y2="13" className="svg-form-line-1" />
        <line x1="16" y1="17" x2="8" y2="17" className="svg-form-line-2" />
      </svg>
    ),
    'cliq': (
      <svg {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" className="svg-chat-bubble" />
      </svg>
    ),
    'mesaj': (
      <svg {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" className="svg-chat-bubble" />
      </svg>
    ),
    'chat': (
      <svg {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" className="svg-chat-bubble" />
      </svg>
    ),
    'survey': (
      <svg {...props}>
        <path d="M9 11l3 3L22 4" className="svg-check-tick" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" className="svg-check-box" />
      </svg>
    ),
    'anket': (
      <svg {...props}>
        <path d="M9 11l3 3L22 4" className="svg-check-tick" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" className="svg-check-box" />
      </svg>
    ),
    'campaign': (
      <svg {...props}>
        <path d="M22 2 11 13" className="svg-plane-line" />
        <path d="M22 2 15 22 11 13 2 9l20-7z" className="svg-plane" />
      </svg>
    ),
    'kampanya': (
      <svg {...props}>
        <path d="M22 2 11 13" className="svg-plane-line" />
        <path d="M22 2 15 22 11 13 2 9l20-7z" className="svg-plane" />
      </svg>
    ),
    'salesiq': (
      <svg {...props}>
        <path d="M18 20V10" className="svg-bar-3" />
        <path d="M12 20V4" className="svg-bar-2" />
        <path d="M6 20v-6" className="svg-bar-1" />
      </svg>
    ),
    'canlı': (
      <svg {...props}>
        <path d="M18 20V10" className="svg-bar-3" />
        <path d="M12 20V4" className="svg-bar-2" />
        <path d="M6 20v-6" className="svg-bar-1" />
      </svg>
    ),
    'muhasebe': (
      <svg {...props}>
        <rect x="1" y="4" width="22" height="16" rx="2" className="svg-card-bg" />
        <line x1="1" y1="10" x2="23" y2="10" className="svg-card-line" />
      </svg>
    ),
    'ödeme': (
      <svg {...props}>
        <rect x="1" y="4" width="22" height="16" rx="2" className="svg-card-bg" />
        <line x1="1" y1="10" x2="23" y2="10" className="svg-card-line" />
      </svg>
    ),
    'payment': (
      <svg {...props}>
        <rect x="1" y="4" width="22" height="16" rx="2" className="svg-card-bg" />
        <line x1="1" y1="10" x2="23" y2="10" className="svg-card-line" />
      </svg>
    ),
    'tahsilat': (
      <svg {...props}>
        <rect x="1" y="4" width="22" height="16" rx="2" className="svg-card-bg" />
        <line x1="1" y1="10" x2="23" y2="10" className="svg-card-line" />
      </svg>
    ),
    'gelir': (
      <svg {...props}>
        <rect x="1" y="4" width="22" height="16" rx="2" className="svg-card-bg" />
        <line x1="1" y1="10" x2="23" y2="10" className="svg-card-line" />
      </svg>
    ),
    'gider': (
      <svg {...props}>
        <rect x="1" y="4" width="22" height="16" rx="2" className="svg-card-bg" />
        <line x1="1" y1="10" x2="23" y2="10" className="svg-card-line" />
      </svg>
    ),
    'banka': (
      <svg {...props}>
        <line x1="3" y1="22" x2="21" y2="22" />
        <line x1="6" y1="18" x2="6" y2="11" className="svg-bank-pillar-1" />
        <line x1="10" y1="18" x2="10" y2="11" className="svg-bank-pillar-2" />
        <line x1="14" y1="18" x2="14" y2="11" className="svg-bank-pillar-3" />
        <line x1="18" y1="18" x2="18" y2="11" className="svg-bank-pillar-4" />
        <polygon points="12 2 20 7 4 7" className="svg-bank-roof" />
      </svg>
    ),
    'operasyon': (
      <svg {...props}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" className="svg-cube" />
      </svg>
    ),
    'havalimanı': (
      <svg {...props}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" className="svg-cube" />
      </svg>
    ),
    'land': (
      <svg {...props}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" className="svg-cube" />
      </svg>
    ),
    'bilet': (
      <svg {...props}>
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" className="svg-ticket" />
      </svg>
    ),
    'vip': (
      <svg {...props}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" className="svg-star" />
      </svg>
    ),
    'kapalı': (
      <svg {...props}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" className="svg-star" />
      </svg>
    ),
    'personel': (
      <svg {...props}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" className="svg-users-body" />
        <circle cx="9" cy="7" r="4" className="svg-users-head" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" className="svg-users-shadow-body" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" className="svg-users-shadow-head" />
      </svg>
    ),
    'insan kaynakları': (
      <svg {...props}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" className="svg-users-body" />
        <circle cx="9" cy="7" r="4" className="svg-users-head" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" className="svg-users-shadow-body" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" className="svg-users-shadow-head" />
      </svg>
    ),
    'kalite': (
      <svg {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="svg-shield" />
        <path d="m9 12 2 2 4-4" className="svg-shield-check" />
      </svg>
    ),
    'iptal': (
      <svg {...props}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" className="svg-cancel-arrow" />
        <path d="M3 3v5h5" />
        <path d="m15 9-6 6" className="svg-cancel-x1" />
        <path d="m9 9 6 6" className="svg-cancel-x2" />
      </svg>
    ),
    'iade': (
      <svg {...props}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" className="svg-cancel-arrow" />
        <path d="M3 3v5h5" />
        <path d="m15 9-6 6" className="svg-cancel-x1" />
        <path d="m9 9 6 6" className="svg-cancel-x2" />
      </svg>
    ),
    'online sales': (
      <svg {...props}>
        <circle cx="9" cy="21" r="1" className="svg-cart-wheel-1" />
        <circle cx="20" cy="21" r="1" className="svg-cart-wheel-2" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" className="svg-cart-basket" />
      </svg>
    ),
    'online satış': (
      <svg {...props}>
        <circle cx="9" cy="21" r="1" className="svg-cart-wheel-1" />
        <circle cx="20" cy="21" r="1" className="svg-cart-wheel-2" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" className="svg-cart-basket" />
      </svg>
    ),
    'sorun': (
      <svg {...props}>
        <circle cx="12" cy="12" r="10" className="svg-alert-circle" />
        <line x1="12" y1="8" x2="12" y2="12" className="svg-alert-line" />
        <line x1="12" y1="16" x2="12.01" y2="16" className="svg-alert-dot" />
      </svg>
    ),
    'maliyet': (
      <svg {...props}>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" className="svg-dollar" />
      </svg>
    ),
    'cost': (
      <svg {...props}>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" className="svg-dollar" />
      </svg>
    ),
    'happy call': (
      <svg {...props}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" className="svg-phone" />
      </svg>
    ),
    'müşteri': (
      <svg {...props}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" className="svg-phone" />
      </svg>
    ),
    'gpt': (
      <svg {...props}>
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" className="svg-robot" />
      </svg>
    ),
    'ai': (
      <svg {...props}>
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" className="svg-robot" />
      </svg>
    ),
    'yapay': (
      <svg {...props}>
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" className="svg-robot" />
      </svg>
    ),
    'sms': (
      <svg {...props}>
        <rect x="5" y="2" width="14" height="20" rx="2" className="svg-sms-phone" />
        <line x1="12" y1="18" x2="12.01" y2="18" className="svg-sms-dot" />
      </svg>
    ),
    'verimor': (
      <svg {...props}>
        <rect x="5" y="2" width="14" height="20" rx="2" className="svg-sms-phone" />
        <line x1="12" y1="18" x2="12.01" y2="18" className="svg-sms-dot" />
      </svg>
    ),
    'creator': (
      <svg {...props}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" className="svg-gear" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    'admin': (
      <svg {...props}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" className="svg-gear" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    'pasaport': (
      <svg {...props}>
        <rect x="3" y="4" width="18" height="16" rx="2" className="svg-passport" />
        <path d="M8 2v4M16 2v4M3 10h18" className="svg-passport-lines" />
      </svg>
    ),
    'vize': (
      <svg {...props}>
        <rect x="3" y="4" width="18" height="16" rx="2" className="svg-passport" />
        <path d="M8 2v4M16 2v4M3 10h18" className="svg-passport-lines" />
      </svg>
    ),
    'duyuru': (
      <svg {...props}>
        <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" className="svg-bell" />
      </svg>
    ),
    'kurumsal': (
      <svg {...props}>
        <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" className="svg-bell" />
      </svg>
    ),
    'akademi': (
      <svg {...props}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" className="svg-academy-cap" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" className="svg-academy-body" />
      </svg>
    ),
  };

  for (const [key, icon] of Object.entries(iconMap)) {
    if (name.includes(key) || code.includes(key.toUpperCase())) {
      return icon;
    }
  }

  // Default fallback is a grid/web portal icon
  return (
    <svg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    </svg>
  );
}

export function getIconClass(portal: Portal): string {
  const name = (portal.name || '').toLowerCase();
  const code = (portal.code || '').toUpperCase();

  const classMap: Record<string, string> = {
    'analytic': 'c-blue',
    'zanl': 'c-blue',
    'crm': 'c-violet',
    'zcrm': 'c-violet',
    'mail': 'c-teal',
    'e-posta': 'c-teal',
    'project': 'c-sky',
    'proje': 'c-sky',
    'workdrive': 'c-emerald',
    'drive': 'c-emerald',
    'dosya': 'c-emerald',
    'flow': 'c-orange',
    'otomasyon': 'c-orange',
    'form': 'c-lime',
    'cliq': 'c-pink',
    'mesaj': 'c-pink',
    'chat': 'c-pink',
    'survey': 'c-teal',
    'anket': 'c-teal',
    'campaign': 'c-rose',
    'kampanya': 'c-rose',
    'salesiq': 'c-indigo',
    'canlı': 'c-indigo',
    'muhasebe': 'c-emerald',
    'ödeme': 'c-emerald',
    'payment': 'c-emerald',
    'tahsilat': 'c-emerald',
    'gelir': 'c-emerald',
    'gider': 'c-emerald',
    'banka': 'c-blue',
    'operasyon': 'c-slate',
    'havalimanı': 'c-slate',
    'land': 'c-slate',
    'bilet': 'c-violet',
    'vip': 'c-amber',
    'kapalı': 'c-amber',
    'personel': 'c-sky',
    'insan kaynakları': 'c-sky',
    'kalite': 'c-teal',
    'iptal': 'c-rose',
    'iade': 'c-rose',
    'online sales': 'c-emerald',
    'online satış': 'c-emerald',
    'sorun': 'c-orange',
    'maliyet': 'c-amber',
    'cost': 'c-amber',
    'happy call': 'c-lime',
    'müşteri': 'c-lime',
    'gpt': 'c-violet',
    'ai': 'c-violet',
    'yapay': 'c-violet',
    'sms': 'c-sky',
    'verimor': 'c-sky',
    'creator': 'c-slate',
    'admin': 'c-slate',
    'pasaport': 'c-rose',
    'vize': 'c-rose',
    'duyuru': 'c-amber',
    'kurumsal': 'c-amber',
    'akademi': 'c-amber',
  };

  for (const [key, classVal] of Object.entries(classMap)) {
    if (name.includes(key) || code.includes(key.toUpperCase())) {
      return classVal;
    }
  }

  return 'c-indigo';
}

export function escapeHtml(text: string): string {
  if (typeof window === 'undefined') return text || '';
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'İyi Geceler';
  if (hour < 12) return 'İyi Sabahlar';
  if (hour < 18) return 'İyi Günler';
  return 'İyi Akşamlar';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

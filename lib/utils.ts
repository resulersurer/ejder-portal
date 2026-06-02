import { Portal } from '@/types/portal';

export const ADMIN_PASSWORD = 'ejder2024';
export const LS_PORTALS = 'ej_portals';
export const LS_WEBSITES = 'ej_websites';
export const LS_TEAMS = 'ej_teams';
export const SESSION_AUTH = 'ej_auth';

export function getPortalIcon(portal: Portal): React.ReactNode {
  const name = (portal.name || '').toLowerCase();
  const code = (portal.code || '').toUpperCase();

  const iconMap: Record<string, string> = {
    'analytic': '📊',
    'zanl': '📊',
    'crm': '👥',
    'zcrm': '👥',
    'mail': '📧',
    'e-posta': '📧',
    'project': '📋',
    'proje': '📋',
    'workdrive': '📁',
    'drive': '📁',
    'dosya': '📁',
    'flow': '⚙️',
    'otomasyon': '⚙️',
    'form': '📝',
    'cliq': '💬',
    'mesaj': '💬',
    'chat': '💬',
    'survey': '📊',
    'anket': '📊',
    'campaign': '📢',
    'kampanya': '📢',
    'salesiq': '📞',
    'canlı': '📞',
    'muhasebe': '💰',
    'ödeme': '💰',
    'payment': '💰',
    'tahsilat': '💰',
    'gelir': '💰',
    'gider': '💰',
    'banka': '🏦',
    'operasyon': '🚀',
    'havalimanı': '✈️',
    'land': '🌍',
    'bilet': '🎫',
    'vip': '⭐',
    'kapalı': '🔒',
    'personel': '👤',
    'insan kaynakları': '👤',
    'kalite': '✅',
    'iptal': '❌',
    'iade': '↩️',
    'online sales': '🛒',
    'online satış': '🛒',
    'sorun': '⚠️',
    'maliyet': '💵',
    'cost': '💵',
    'happy call': '😊',
    'müşteri': '😊',
    'gpt': '🤖',
    'ai': '🤖',
    'yapay': '🤖',
    'sms': '📱',
    'verimor': '📱',
    'creator': '⚙️',
    'admin': '⚙️',
    'pasaport': '📖',
    'vize': '📖',
    'duyuru': '📣',
    'kurumsal': '📣',
  };

  for (const [key, icon] of Object.entries(iconMap)) {
    if (name.includes(key) || code.includes(key.toUpperCase())) {
      return icon;
    }
  }

  return '📱';
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
  };

  for (const [key, classVal] of Object.entries(classMap)) {
    if (name.includes(key) || code.includes(key.toUpperCase())) {
      return classVal;
    }
  }

  return 'c-indigo';
}

export function escapeHtml(text: string): string {
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

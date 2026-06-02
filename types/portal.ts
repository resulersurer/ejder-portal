export interface Portal {
  id: string;
  code: string;
  name: string;
  url: string;
  portalType: 'Private' | 'Public' | 'Restricted';
  users: number;
  teams: string[];
  about: string;
  trainingPdf?: string;
}

export interface Website {
  id: string;
  code: string;
  name: string;
  url: string;
  about: string;
}

export type ViewMode = 'apps' | 'about' | 'websites' | 'admin';

export interface AppState {
  portals: Portal[];
  websites: Website[];
  teams: string[];
  isAuthenticated: boolean;
  currentView: ViewMode;
  currentFilter: string;
  searchTerm: string;
}

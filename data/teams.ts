import { defaultPortals } from './portals';

// Extract unique teams from portals
export const defaultTeams: string[] = [
  ...new Set(defaultPortals.flatMap((p) => p.teams)),
].sort();

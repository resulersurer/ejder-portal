import React from 'react';
import PortalClient from './PortalClient';
import { getPortals, getWebsites, getTeams } from '@/lib/db';

// Force dynamic rendering to fetch fresh database content on every request
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch initial data from the Neon database
  const [portals, websites, teams] = await Promise.all([
    getPortals(),
    getWebsites(),
    getTeams(),
  ]);

  return (
    <PortalClient
      initialPortals={portals}
      initialWebsites={websites}
      initialTeams={teams}
    />
  );
}

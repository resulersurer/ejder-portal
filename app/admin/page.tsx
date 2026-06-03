import React from 'react';
import AdminClient from './AdminClient';
import { getPortals, getWebsites, getTeams } from '@/lib/db';

// Force dynamic rendering to fetch fresh database content on every request
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [portals, websites, teams] = await Promise.all([
    getPortals(),
    getWebsites(),
    getTeams(),
  ]);

  return (
    <AdminClient
      initialPortals={portals}
      initialWebsites={websites}
      initialTeams={teams}
    />
  );
}

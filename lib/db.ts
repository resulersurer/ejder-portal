import { neon } from '@neondatabase/serverless';
import { Portal, Website } from '@/types/portal';
import { defaultPortals } from '@/data/portals';
import { defaultWebsites } from '@/data/websites';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn(
    '⚠️ DATABASE_URL environment variable is not defined. The app will fall back to using static default data.'
  );
}

// Instantiate neon SQL client only if DATABASE_URL is available
export const sql = databaseUrl ? neon(databaseUrl) : null;

/**
 * Maps database portal row to Portal interface
 */
function mapPortal(row: any): Portal {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    url: row.url,
    portalType: row.portal_type as 'Private' | 'Public' | 'Restricted',
    users: Number(row.users) || 0,
    teams: Array.isArray(row.teams) ? row.teams : [],
    about: row.about || '',
    trainingPdf: row.training_pdf || undefined,
  };
}

/**
 * Maps database website row to Website interface
 */
function mapWebsite(row: any): Website {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    url: row.url,
    about: row.about || '',
  };
}

/**
 * Initializes the database tables and seeds them if they are empty
 */
export async function initDb() {
  if (!sql) {
    return;
  }

  try {
    // 1. Create Teams table
    await sql`
      CREATE TABLE IF NOT EXISTS ejder_teams (
        name VARCHAR(100) PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Create Portals table
    await sql`
      CREATE TABLE IF NOT EXISTS ejder_portals (
        id VARCHAR(100) PRIMARY KEY,
        code VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        portal_type VARCHAR(50) NOT NULL DEFAULT 'Private',
        users INTEGER NOT NULL DEFAULT 0,
        teams TEXT[] NOT NULL DEFAULT '{}',
        about TEXT NOT NULL DEFAULT '',
        training_pdf TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Create Websites table
    await sql`
      CREATE TABLE IF NOT EXISTS ejder_websites (
        id VARCHAR(100) PRIMARY KEY,
        code VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        about TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 4. Auto-seed Teams
    const teamsCountResult = await sql`SELECT COUNT(*)::integer as count FROM ejder_teams;`;
    const teamsCount = teamsCountResult[0]?.count || 0;
    if (teamsCount === 0) {
      console.log('Seeding default teams...');
      const defaultTeamsSet = new Set(defaultPortals.flatMap((p) => p.teams));
      const defaultTeams = Array.from(defaultTeamsSet).sort();
      for (const team of defaultTeams) {
        await sql`
          INSERT INTO ejder_teams (name) VALUES (${team}) ON CONFLICT DO NOTHING;
        `;
      }
    }

    // 5. Auto-seed Portals
    const portalsCountResult = await sql`SELECT COUNT(*)::integer as count FROM ejder_portals;`;
    const portalsCount = portalsCountResult[0]?.count || 0;
    if (portalsCount === 0) {
      console.log('Seeding default portals...');
      for (const p of defaultPortals) {
        await sql`
          INSERT INTO ejder_portals (id, code, name, url, portal_type, users, teams, about, training_pdf)
          VALUES (${p.id}, ${p.code}, ${p.name}, ${p.url}, ${p.portalType}, ${p.users}, ${p.teams}, ${p.about}, ${p.trainingPdf || null})
          ON CONFLICT DO NOTHING;
        `;
      }
    }

    // 6. Auto-seed Websites
    const websitesCountResult = await sql`SELECT COUNT(*)::integer as count FROM ejder_websites;`;
    const websitesCount = websitesCountResult[0]?.count || 0;
    if (websitesCount === 0) {
      console.log('Seeding default websites...');
      for (const w of defaultWebsites) {
        await sql`
          INSERT INTO ejder_websites (id, code, name, url, about)
          VALUES (${w.id}, ${w.code}, ${w.name}, ${w.url}, ${w.about})
          ON CONFLICT DO NOTHING;
        `;
      }
    }
  } catch (error) {
    console.error('Error initializing database tables/seed:', error);
  }
}

/**
 * Fetch all portals
 */
export async function getPortals(): Promise<Portal[]> {
  if (!sql) {
    return [...defaultPortals].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  }
  try {
    await initDb();
    const rows = await sql`SELECT * FROM ejder_portals;`;
    const portals = rows.map(mapPortal);
    return portals.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  } catch (error) {
    console.error('Error fetching portals:', error);
    return [...defaultPortals].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  }
}

/**
 * Fetch all websites
 */
export async function getWebsites(): Promise<Website[]> {
  if (!sql) {
    return [...defaultWebsites].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  }
  try {
    await initDb();
    const rows = await sql`SELECT * FROM ejder_websites;`;
    const websites = rows.map(mapWebsite);
    return websites.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  } catch (error) {
    console.error('Error fetching websites:', error);
    return [...defaultWebsites].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  }
}

/**
 * Fetch all team names
 */
export async function getTeams(): Promise<string[]> {
  if (!sql) {
    const defaultTeamsSet = new Set(defaultPortals.flatMap((p) => p.teams));
    return Array.from(defaultTeamsSet).sort((a, b) => a.localeCompare(b, 'tr'));
  }
  try {
    await initDb();
    const rows = await sql`SELECT name FROM ejder_teams;`;
    const teamNames = rows.map((r: any) => r.name);
    return teamNames.sort((a, b) => a.localeCompare(b, 'tr'));
  } catch (error) {
    console.error('Error fetching teams:', error);
    const defaultTeamsSet = new Set(defaultPortals.flatMap((p) => p.teams));
    return Array.from(defaultTeamsSet).sort((a, b) => a.localeCompare(b, 'tr'));
  }
}

/**
 * Save or update a portal
 */
export async function savePortal(portal: Portal): Promise<void> {
  if (!sql) {
    throw new Error('Database connection not established (no DATABASE_URL).');
  }
  try {
    await initDb();
    await sql`
      INSERT INTO ejder_portals (id, code, name, url, portal_type, users, teams, about, training_pdf)
      VALUES (
        ${portal.id},
        ${portal.code},
        ${portal.name},
        ${portal.url},
        ${portal.portalType},
        ${portal.users},
        ${portal.teams},
        ${portal.about},
        ${portal.trainingPdf || null}
      )
      ON CONFLICT (id)
      DO UPDATE SET
        code = EXCLUDED.code,
        name = EXCLUDED.name,
        url = EXCLUDED.url,
        portal_type = EXCLUDED.portal_type,
        users = EXCLUDED.users,
        teams = EXCLUDED.teams,
        about = EXCLUDED.about,
        training_pdf = EXCLUDED.training_pdf;
    `;
  } catch (error) {
    console.error('Error saving portal:', error);
    throw error;
  }
}

/**
 * Delete a portal by ID
 */
export async function deletePortal(id: string): Promise<void> {
  if (!sql) {
    throw new Error('Database connection not established (no DATABASE_URL).');
  }
  try {
    await initDb();
    await sql`DELETE FROM ejder_portals WHERE id = ${id};`;
  } catch (error) {
    console.error('Error deleting portal:', error);
    throw error;
  }
}

/**
 * Save or update a website
 */
export async function saveWebsite(website: Website): Promise<void> {
  if (!sql) {
    throw new Error('Database connection not established (no DATABASE_URL).');
  }
  try {
    await initDb();
    await sql`
      INSERT INTO ejder_websites (id, code, name, url, about)
      VALUES (${website.id}, ${website.code}, ${website.name}, ${website.url}, ${website.about})
      ON CONFLICT (id)
      DO UPDATE SET
        code = EXCLUDED.code,
        name = EXCLUDED.name,
        url = EXCLUDED.url,
        about = EXCLUDED.about;
    `;
  } catch (error) {
    console.error('Error saving website:', error);
    throw error;
  }
}

/**
 * Delete a website by ID
 */
export async function deleteWebsite(id: string): Promise<void> {
  if (!sql) {
    throw new Error('Database connection not established (no DATABASE_URL).');
  }
  try {
    await initDb();
    await sql`DELETE FROM ejder_websites WHERE id = ${id};`;
  } catch (error) {
    console.error('Error deleting website:', error);
    throw error;
  }
}

/**
 * Add a new team
 */
export async function saveTeam(name: string): Promise<void> {
  if (!sql) {
    throw new Error('Database connection not established (no DATABASE_URL).');
  }
  try {
    await initDb();
    const formatted = name.toUpperCase().trim();
    await sql`
      INSERT INTO ejder_teams (name) VALUES (${formatted}) ON CONFLICT DO NOTHING;
    `;
  } catch (error) {
    console.error('Error saving team:', error);
    throw error;
  }
}

/**
 * Delete a team and clean up its references in portals
 */
export async function deleteTeam(name: string): Promise<void> {
  if (!sql) {
    throw new Error('Database connection not established (no DATABASE_URL).');
  }
  try {
    await initDb();
    // 1. Delete from teams table
    await sql`DELETE FROM ejder_teams WHERE name = ${name};`;
    // 2. Remove team from all portals' teams arrays
    await sql`UPDATE ejder_portals SET teams = array_remove(teams, ${name});`;
  } catch (error) {
    console.error('Error deleting team:', error);
    throw error;
  }
}

import { NextResponse } from 'next/server';
import { saveTeam } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name } = (await request.json()) as { name: string };
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Team name is required.' }, { status: 400 });
    }

    await saveTeam(name);
    return NextResponse.json({ success: true, name: name.toUpperCase().trim() });
  } catch (error: any) {
    console.error('API Error in POST /api/teams:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save team' },
      { status: 500 }
    );
  }
}

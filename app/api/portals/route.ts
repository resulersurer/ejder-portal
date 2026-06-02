import { NextResponse } from 'next/server';
import { savePortal } from '@/lib/db';
import { Portal } from '@/types/portal';

export async function POST(request: Request) {
  try {
    const portal = (await request.json()) as Portal;
    if (!portal || !portal.id || !portal.code || !portal.name || !portal.url) {
      return NextResponse.json(
        { error: 'id, code, name, and url are required fields.' },
        { status: 400 }
      );
    }

    await savePortal(portal);
    return NextResponse.json({ success: true, portal });
  } catch (error: any) {
    console.error('API Error in POST /api/portals:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save portal' },
      { status: 500 }
    );
  }
}

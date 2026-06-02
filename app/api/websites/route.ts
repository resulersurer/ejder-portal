import { NextResponse } from 'next/server';
import { saveWebsite } from '@/lib/db';
import { Website } from '@/types/portal';

export async function POST(request: Request) {
  try {
    const website = (await request.json()) as Website;
    if (!website || !website.id || !website.code || !website.name || !website.url) {
      return NextResponse.json(
        { error: 'id, code, name, and url are required fields.' },
        { status: 400 }
      );
    }

    await saveWebsite(website);
    return NextResponse.json({ success: true, website });
  } catch (error: any) {
    console.error('API Error in POST /api/websites:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save website' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { deleteTeam } from '@/lib/db';

export async function DELETE(
  request: Request,
  props: { params: Promise<{ name: string }> }
) {
  try {
    const { name: encodedName } = await props.params;
    if (!encodedName) {
      return NextResponse.json({ error: 'Team name is required.' }, { status: 400 });
    }

    const name = decodeURIComponent(encodedName);
    await deleteTeam(name);
    return NextResponse.json({ success: true, name });
  } catch (error: any) {
    console.error('API Error in DELETE /api/teams/[name]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete team' },
      { status: 500 }
    );
  }
}

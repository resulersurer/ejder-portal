import { NextResponse } from 'next/server';
import { deletePortal } from '@/lib/db';

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    if (!id) {
      return NextResponse.json({ error: 'Portal id is required.' }, { status: 400 });
    }

    await deletePortal(id);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('API Error in DELETE /api/portals/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete portal' },
      { status: 500 }
    );
  }
}

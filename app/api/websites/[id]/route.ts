import { NextResponse } from 'next/server';
import { deleteWebsite } from '@/lib/db';

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    if (!id) {
      return NextResponse.json({ error: 'Website id is required.' }, { status: 400 });
    }

    await deleteWebsite(id);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('API Error in DELETE /api/websites/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete website' },
      { status: 500 }
    );
  }
}

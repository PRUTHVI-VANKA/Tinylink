import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('code', code)
      .eq('is_deleted', false)
      .maybeSingle();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch link' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    const { data: existing } = await supabase
      .from('links')
      .select('id')
      .eq('code', code)
      .eq('is_deleted', false)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from('links')
      .update({ is_deleted: true, updated_at: new Date().toISOString() })
      .eq('code', code);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to delete link' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateCode, isValidCode, isValidUrl } from '@/lib/utils/code-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { target_url, code: customCode } = body;

    if (!target_url || typeof target_url !== 'string') {
      return NextResponse.json(
        { error: 'target_url is required' },
        { status: 400 }
      );
    }

    if (!isValidUrl(target_url)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    let code = customCode;

    if (customCode) {
      if (!isValidCode(customCode)) {
        return NextResponse.json(
          { error: 'Custom code must be 6-8 alphanumeric characters' },
          { status: 400 }
        );
      }

      const { data: existing } = await supabase
        .from('links')
        .select('id')
        .eq('code', customCode)
        .eq('is_deleted', false)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: 'Code already exists' },
          { status: 409 }
        );
      }
    } else {
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        code = generateCode(6);
        const { data: existing } = await supabase
          .from('links')
          .select('id')
          .eq('code', code)
          .eq('is_deleted', false)
          .maybeSingle();

        if (!existing) {
          break;
        }
        attempts++;
      }

      if (attempts === maxAttempts) {
        return NextResponse.json(
          { error: 'Failed to generate unique code' },
          { status: 500 }
        );
      }
    }

    const { data, error } = await supabase
      .from('links')
      .insert({
        code,
        target_url,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create link' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch links' },
        { status: 500 }
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

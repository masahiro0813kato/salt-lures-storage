import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const seriesName = searchParams.get('name');
    const excludeId = searchParams.get('excludeId');

    if (!seriesName) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const supabase = await createClient();

    let query = supabase
      .from('lures')
      .select(`
        *,
        lure_maker:lure_makers(id, lure_maker_name_ja, lure_maker_name_en, lure_maker_logo_image),
        lure_category:lure_categories(id, category_name_ja, category_name_en)
      `)
      .eq('lure_series_ja', seriesName)
      .eq('is_available', true)
      .order('lure_name_ja', { ascending: true });

    if (excludeId) {
      query = query.neq('id', parseInt(excludeId, 10));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Series query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch series', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ lures: data || [] });
  } catch (error) {
    console.error('Series API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

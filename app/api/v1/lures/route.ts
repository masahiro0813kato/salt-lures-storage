import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    const supabase = await createClient();

    // ベースクエリ
    let query = supabase
      .from('lures')
      .select(
        `
        *,
        lure_maker:lure_makers(id, lure_maker_name_ja, lure_maker_name_en, lure_maker_logo_image),
        lure_category:lure_categories(id, category_name_ja, category_name_en)
        `,
        { count: 'exact' }
      )
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    // 検索条件
    if (search) {
      query = query.or(
        `lure_name_ja.ilike.%${search}%,lure_name_en.ilike.%${search}%`
      );
    }

    // ページネーション
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch lures', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      lures: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

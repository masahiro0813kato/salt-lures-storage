import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';

    if (!search || search.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const supabase = await createClient();

    // ルアー名とメーカー名の両方で検索
    // Supabaseではリレーション先のフィールドを直接検索できないため、
    // まずメーカーを検索してIDを取得し、それを使ってルアーを検索する
    const { data: makers } = await supabase
      .from('lure_makers')
      .select('id')
      .or(`lure_maker_name_ja.ilike.%${search}%,lure_maker_name_en.ilike.%${search}%`)
      .eq('is_available', true);

    const makerIds = makers?.map((m) => m.id) || [];

    // ルアー名で検索 OR メーカーIDに一致
    let query = supabase
      .from('lures')
      .select(
        `
        id,
        url_code,
        lure_name_ja,
        lure_name_en,
        lure_tmb_small,
        lure_maker:lure_makers(lure_maker_name_ja, lure_maker_name_en)
        `
      )
      .eq('is_available', true);

    if (makerIds.length > 0) {
      // メーカー名またはルアー名で検索
      query = query.or(
        `lure_name_ja.ilike.%${search}%,lure_name_en.ilike.%${search}%,lure_maker_id.in.(${makerIds.join(',')})`
      );
    } else {
      // ルアー名のみで検索
      query = query.or(`lure_name_ja.ilike.%${search}%,lure_name_en.ilike.%${search}%`);
    }

    const { data, error } = await query
      .order('view_count', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch suggestions', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      suggestions: data || [],
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

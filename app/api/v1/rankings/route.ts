import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'monthly';
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // 期間の計算
    const now = new Date();
    let since: Date;

    if (period === 'yearly') {
      since = new Date(now);
      since.setFullYear(since.getFullYear() - 1);
    } else {
      since = new Date(now);
      since.setDate(since.getDate() - 30);
    }

    const supabase = await createClient();

    // page_viewsから期間内の閲覧数を集計
    // Supabaseではgroup byが直接使えないのでRPCまたはSQL viewを使う
    const { data, error } = await supabase
      .rpc('get_lure_rankings', {
        since_date: since.toISOString(),
        result_limit: limit,
      });

    if (error) {
      console.error('Rankings query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch rankings', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      period,
      rankings: data || [],
    });
  } catch (error) {
    console.error('Rankings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

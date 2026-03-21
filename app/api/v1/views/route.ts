import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { lureId } = await request.json();

    if (!lureId || typeof lureId !== 'number') {
      return NextResponse.json({ error: 'Invalid lureId' }, { status: 400 });
    }

    // IPアドレスを取得しハッシュ化
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
    const ipHash = createHash('sha256').update(ip).digest('hex');

    // 今日の日付範囲を計算
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const supabase = await createClient();

    // 同一IP + 同一ルアー + 今日の日付で重複チェック
    const { data: existing } = await supabase
      .from('page_views')
      .select('id')
      .eq('lure_id', lureId)
      .eq('ip_hash', ipHash)
      .gte('viewed_at', today.toISOString())
      .lt('viewed_at', tomorrow.toISOString())
      .limit(1);

    if (existing && existing.length > 0) {
      return new NextResponse(null, { status: 204 });
    }

    // 閲覧レコードを追加
    const { error: insertError } = await supabase
      .from('page_views')
      .insert({ lure_id: lureId, ip_hash: ipHash });

    if (insertError) {
      console.error('Failed to insert page view:', insertError);
      return NextResponse.json({ error: 'Failed to record view' }, { status: 500 });
    }

    // lures.view_countをインクリメント
    await supabase.rpc('increment_view_count', { lure_id_param: lureId });

    return NextResponse.json({ recorded: true }, { status: 201 });
  } catch (error) {
    console.error('View tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

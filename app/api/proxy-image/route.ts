import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  console.log('📥 Proxy image request:', url);

  if (!url) {
    console.error('❌ No URL parameter provided');
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Supabaseから画像を取得
    console.log('🔄 Fetching from Supabase:', url);
    const response = await fetch(url);

    if (!response.ok) {
      console.error('❌ Supabase fetch failed:', response.status, response.statusText);
      console.log('⚠️ Returning 404 to trigger fallback to default image');
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const blob = await response.blob();
    console.log('✅ Image fetched successfully, size:', blob.size);

    // CORSヘッダー付きで返す
    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/png',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('❌ Proxy image error:', error);
    return NextResponse.json({ error: 'Failed to proxy image' }, { status: 500 });
  }
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'video';
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    // 1. Tarik maklumat asas video/channel dari search.list
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=${type}&maxResults=10&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.error) {
      return NextResponse.json({ error: searchData.error.message }, { status: 500 });
    }

    if (type !== 'video' || !searchData.items || searchData.items.length === 0) {
      return NextResponse.json(searchData);
    }

    // 2. Kumpul Video ID untuk dapatkan data views & duration dari videos.list
    const videoIds = searchData.items.map((item: any) => item.id.videoId).filter(Boolean);

    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds.join(',')}&key=${apiKey}`;
    const videosRes = await fetch(videosUrl);
    const videosData = await videosRes.json();

    // 3. Gabungkan data
    const enrichedItems = searchData.items.map((searchItem: any) => {
      const details = videosData.items?.find((vItem: any) => vItem.id === searchItem.id.videoId);
      return {
        ...searchItem,
        statistics: details?.statistics || null,
        contentDetails: details?.contentDetails || null,
      };
    });

    return NextResponse.json({
      ...searchData,
      items: enrichedItems,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
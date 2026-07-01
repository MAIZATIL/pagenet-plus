// app/api/youtube/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const type = searchParams.get('type') || 'video';
  const order = searchParams.get('order') || 'relevance';
  const pageToken = searchParams.get('pageToken');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'YouTube API key is not configured' }, { status: 500 });
  }

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('q', query);
    url.searchParams.set('type', type);
    url.searchParams.set('order', order);
    url.searchParams.set('maxResults', '10');
    url.searchParams.set('key', apiKey);
    if (pageToken) {
      url.searchParams.set('pageToken', pageToken);
    }

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'YouTube API error' }, { status: response.status });
    }

    // Fetch statistics for each video
    const videoIds = data.items
      .filter((item: any) => item.id?.videoId)
      .map((item: any) => item.id.videoId)
      .join(',');

    let statisticsData = {};
    if (videoIds) {
      const statsUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
      statsUrl.searchParams.set('part', 'statistics');
      statsUrl.searchParams.set('id', videoIds);
      statsUrl.searchParams.set('key', apiKey);
      
      const statsResponse = await fetch(statsUrl.toString());
      statisticsData = await statsResponse.json();
    }

    // Merge statistics with search results
    const itemsWithStats = data.items.map((item: any) => {
      if (item.id?.videoId) {
        const stats = (statisticsData as any).items?.find((s: any) => s.id === item.id.videoId);
        return {
          ...item,
          statistics: stats?.statistics || {}
        };
      }
      return item;
    });

    return NextResponse.json({
      ...data,
      items: itemsWithStats,
      nextPageToken: data.nextPageToken
    });
  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const contentType = searchParams.get('type') || 'video';
  const sortBy = searchParams.get('order') || 'relevance';
  const pageToken = searchParams.get('pageToken') || ''; // Ambil token page dari frontend

  const apiKey = 'AIzaSyB20PVjQIVoiawwbWKycWXDIOcrdygfsc0';

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // Tambah &pageToken=${pageToken} ke dalam URL YouTube API
    let searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=${contentType}&order=${sortBy}&maxResults=12&key=${apiKey}`;
    if (pageToken) {
      searchUrl += `&pageToken=${pageToken}`;
    }

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchRes.ok) {
      return NextResponse.json({ error: searchData.error?.message || 'YouTube API search failure' }, { status: searchRes.status });
    }

    const items = searchData.items || [];
    const nextPageToken = searchData.nextPageToken || null; // Simpan token halaman seterusnya

    if (items.length === 0) {
      return NextResponse.json({ items: [], nextPageToken: null });
    }

    // Ambil statistik tambahan (views/likes) untuk video/channel
    const idList = items.map((item: any) => {
      if (contentType === 'video') return item.id?.videoId;
      if (contentType === 'channel') return item.id?.channelId;
      return null;
    }).filter(Boolean).join(',');

    if (idList && (contentType === 'video' || contentType === 'channel')) {
      const endpoint = contentType === 'video' ? 'videos' : 'channels';
      const statsUrl = `https://www.googleapis.com/youtube/v3/${endpoint}?part=statistics&id=${idList}&key=${apiKey}`;
      const statsRes = await fetch(statsUrl);
      const statsData = await statsRes.json();

      if (statsRes.ok && statsData.items) {
        const statsMap = new Map(statsData.items.map((i: any) => [i.id, i.statistics]));
        items.forEach((item: any) => {
          const targetId = contentType === 'video' ? item.id?.videoId : item.id?.channelId;
          if (targetId && statsMap.has(targetId)) {
            item.statistics = statsMap.get(targetId);
          }
        });
      }
    }

    // Pulangkan sekali nextPageToken ke frontend
    return NextResponse.json({ items, nextPageToken });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
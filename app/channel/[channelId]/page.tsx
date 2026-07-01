'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ channelId: string }>;
}

export default function ChannelProfilePage({ params }: PageProps) {
  const { channelId } = use(params);
  const [channelData, setChannelData] = useState<any>(null);
  const [latestVideos, setLatestVideos] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'videos' | 'playlists' | 'about'>('videos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiKey = 'AIzaSyB20PVjQIVoiawwbWKycWXDIOcrdygfsc0';

  useEffect(() => {
    const fetchChannelEcosystem = async () => {
      if (!channelId) return;
      setLoading(true);
      setError('');

      try {
        const channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${apiKey}`);
        const channelJson = await channelRes.json();

        if (channelJson.items && channelJson.items.length > 0) {
          setChannelData(channelJson.items[0]);
        } else {
          throw new Error('Channel matrix node not found.');
        }

        const videosRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=12&order=date&type=video&key=${apiKey}`);
        const videosJson = await videosRes.json();
        if (videosJson.items) setLatestVideos(videosJson.items);

        const playlistsRes = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${channelId}&maxResults=6&key=${apiKey}`);
        const playlistsJson = await playlistsRes.json();
        if (playlistsJson.items) setPlaylists(playlistsJson.items);

      } catch (err: any) {
        setError(err.message || 'An error occurred while resolving channel telemetries.');
      } finally {
        setLoading(false);
      }
    };

    fetchChannelEcosystem();
  }, [channelId]);

  const formatViews = (views: string) => {
    if (!views) return '0';
    const num = parseInt(views, 10);
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-xs">Resolving channel node architecture...</div>;
  if (error) return <div className="min-h-screen bg-slate-950 text-red-400 flex items-center justify-center text-xs">⚠️ Error: {error}</div>;

  const snippet = channelData?.snippet;
  const stats = channelData?.statistics;
  const branding = channelData?.brandingSettings;
  const bannerUrl = branding?.image?.bannerExternalUrl ? `${branding.image.bannerExternalUrl}=w1060-fcrop64=1,00005a57ffffa5a7-k-c0xffffffff-no-nd-rj` : null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="w-full h-36 md:h-48 bg-slate-900 relative overflow-hidden">
        {bannerUrl ? <img src={bannerUrl} alt="" className="w-full h-full object-cover opacity-80" /> : <div className="w-full h-full bg-slate-900" />}
        <div className="absolute top-4 left-6 z-10">
          <Link href="/" className="px-3 py-1.5 bg-slate-950/80 text-xs text-slate-300 rounded-lg border border-slate-800/80">← Return Hub</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 -mt-10 relative z-20 pb-16">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left mb-8">
          <img src={snippet?.thumbnails?.high?.url} alt="" className="w-24 h-24 rounded-full border-4 border-slate-950 object-cover shadow-xl" />
          <div className="mb-2">
            <h1 className="text-2xl font-black text-slate-100">{snippet?.title}</h1>
            <p className="text-xs text-red-400 font-mono">{snippet?.customUrl || `@${channelId}`}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 bg-slate-900/60 border border-slate-800/60 p-4 rounded-xl max-w-xl mb-8 text-center md:text-left">
          <div>
            <span className="block text-slate-500 text-[10px] uppercase font-bold">Subscribers</span>
            <span className="text-slate-200 font-bold text-sm">{formatViews(stats?.subscriberCount)}</span>
          </div>
          <div>
            <span className="block text-slate-500 text-[10px] uppercase font-bold">Total Views</span>
            <span className="text-slate-200 font-bold text-sm">{formatViews(stats?.viewCount)}</span>
          </div>
          <div>
            <span className="block text-slate-500 text-[10px] uppercase font-bold">Videos</span>
            <span className="text-slate-200 font-bold text-sm">{formatViews(stats?.videoCount)}</span>
          </div>
        </div>

        <div className="flex border-b border-slate-800 mb-6 gap-2">
          {(['playlists', 'videos', 'about'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 -mb-[2px] ${activeTab === tab ? 'border-red-600 text-slate-100' : 'border-transparent text-slate-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div>
          {activeTab === 'videos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestVideos.map((video) => {
                const videoId = video.id?.videoId;
                if (!videoId) return null;
                return (
                  <div key={videoId} className="bg-slate-900 border border-slate-800/40 rounded-xl overflow-hidden flex flex-col justify-between group">
                    <img src={video.snippet?.thumbnails?.high?.url} alt="" className="aspect-video object-cover" />
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <Link href={`/video/${videoId}`} className="font-bold text-xs md:text-sm text-slate-200 hover:text-red-400 line-clamp-2">
                        {video.snippet?.title}
                      </Link>
                      <span className="text-[10px] text-slate-500 block mt-3">{new Date(video.snippet?.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((p) => (
                <div key={p.id} className="bg-slate-900 border border-slate-800/40 rounded-xl overflow-hidden">
                  <img src={p.snippet?.thumbnails?.high?.url} alt="" className="aspect-video object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-xs text-slate-200 line-clamp-2">{p.snippet?.title}</h3>
                    <a href={`https://www.youtube.com/playlist?list=${p.id}`} target="_blank" rel="noreferrer" className="text-[10px] text-red-400 block mt-4">Open Playlist ↗</a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 max-w-3xl">
              <p className="text-xs md:text-sm text-slate-300 font-light leading-relaxed whitespace-pre-wrap">{snippet?.description || 'No summary context.'}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
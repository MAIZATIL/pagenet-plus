// app/channel/[channelId]/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ExternalLink, Users, Eye, Video, Calendar, ArrowLeft, Play, List, Info } from 'lucide-react';

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

  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';

  useEffect(() => {
    const fetchChannelEcosystem = async () => {
      if (!channelId) return;
      setLoading(true);
      setError('');

      if (!apiKey) {
        setError('YouTube API key is not configured.');
        setLoading(false);
        return;
      }

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

  if (loading) return (
    <div className="min-h-screen bg-slate-950 text-slate-400 flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      <p className="text-sm">Resolving channel node architecture...</p>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-slate-950 text-red-400 flex flex-col items-center justify-center gap-4 p-4">
      <p className="text-sm text-center max-w-md">⚠️ Error: {error}</p>
      <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">← Return Home</Link>
    </div>
  );

  const snippet = channelData?.snippet;
  const stats = channelData?.statistics;
  const branding = channelData?.brandingSettings;
  const bannerUrl = branding?.image?.bannerExternalUrl ? `${branding.image.bannerExternalUrl}=w1060-fcrop64=1,00005a57ffffa5a7-k-c0xffffffff-no-nd-rj` : null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Banner */}
      <div className="w-full h-36 md:h-48 bg-slate-900 relative overflow-hidden">
        {bannerUrl ? (
          <img src={bannerUrl} alt="" className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-slate-900 to-slate-800" />
        )}
        <div className="absolute top-4 left-4 md:left-6 z-10">
          <Link 
            href="/" 
            className="px-3 py-1.5 bg-slate-950/80 hover:bg-slate-800/80 text-xs text-slate-300 rounded-lg border border-slate-800/80 transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return Hub
          </Link>
        </div>
      </div>

      {/* Channel Info */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-10 relative z-20 pb-16">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 text-center md:text-left mb-6">
          <img 
            src={snippet?.thumbnails?.high?.url} 
            alt={snippet?.title} 
            className="w-24 h-24 rounded-full border-4 border-slate-950 object-cover shadow-xl" 
          />
          <div className="flex-1 mb-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-100">{snippet?.title}</h1>
            <p className="text-xs text-slate-400 font-mono">
              {snippet?.customUrl || `@${channelId}`}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 bg-slate-900/60 border border-slate-800/60 p-4 rounded-xl max-w-xl mb-8 text-center">
          <div>
            <span className="block text-slate-500 text-[10px] uppercase font-bold flex items-center justify-center gap-1">
              <Users className="w-3 h-3" /> Subscribers
            </span>
            <span className="text-slate-200 font-bold text-sm">{formatViews(stats?.subscriberCount)}</span>
          </div>
          <div>
            <span className="block text-slate-500 text-[10px] uppercase font-bold flex items-center justify-center gap-1">
              <Eye className="w-3 h-3" /> Views
            </span>
            <span className="text-slate-200 font-bold text-sm">{formatViews(stats?.viewCount)}</span>
          </div>
          <div>
            <span className="block text-slate-500 text-[10px] uppercase font-bold flex items-center justify-center gap-1">
              <Video className="w-3 h-3" /> Videos
            </span>
            <span className="text-slate-200 font-bold text-sm">{formatViews(stats?.videoCount)}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 mb-6 gap-1 overflow-x-auto">
          {[
            { id: 'videos', label: 'Videos', icon: Play },
            { id: 'playlists', label: 'Playlists', icon: List },
            { id: 'about', label: 'About', icon: Info }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 -mb-[2px] transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-red-600 text-slate-100' 
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'videos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {latestVideos.length === 0 ? (
                <p className="text-slate-400 text-sm col-span-full text-center py-8">No videos found.</p>
              ) : (
                latestVideos.map((video) => {
                  const videoId = video.id?.videoId;
                  if (!videoId) return null;
                  return (
                    <Link 
                      href={`/video/${videoId}`} 
                      key={videoId} 
                      className="bg-slate-900 border border-slate-800/40 rounded-xl overflow-hidden hover:border-slate-700 transition-all group"
                    >
                      <div className="relative aspect-video">
                        <img 
                          src={video.snippet?.thumbnails?.high?.url} 
                          alt={video.snippet?.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-sm text-slate-200 hover:text-red-400 line-clamp-2 transition-colors">
                          {video.snippet?.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(video.snippet?.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {playlists.length === 0 ? (
                <p className="text-slate-400 text-sm col-span-full text-center py-8">No playlists found.</p>
              ) : (
                playlists.map((p) => (
                  <div key={p.id} className="bg-slate-900 border border-slate-800/40 rounded-xl overflow-hidden hover:border-slate-700 transition-all">
                    <img 
                      src={p.snippet?.thumbnails?.high?.url} 
                      alt={p.snippet?.title} 
                      className="aspect-video object-cover" 
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-slate-200 line-clamp-2">{p.snippet?.title}</h3>
                      <a 
                        href={`https://www.youtube.com/playlist?list=${p.id}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 mt-3"
                      >
                        Open Playlist <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 max-w-3xl">
              <p className="text-sm text-slate-300 font-light leading-relaxed whitespace-pre-wrap">
                {snippet?.description || 'No description available for this channel.'}
              </p>
              {snippet?.publishedAt && (
                <p className="text-xs text-slate-500 mt-4">
                  Joined {new Date(snippet.publishedAt).toLocaleDateString()}
                </p>
              )}
              {snippet?.country && (
                <p className="text-xs text-slate-500 mt-1">
                  Country: {snippet.country}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
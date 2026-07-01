// app/video/[videoId]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, ThumbsUp, MessageCircle, User, Calendar, Share2, Copy, ExternalLink } from 'lucide-react';

interface PageProps {
  params: Promise<{ videoId: string }>;
}

export default function VideoDetailPage({ params }: PageProps) {
  const { videoId } = use(params);
  const [videoData, setVideoData] = useState<any>(null);
  const [channelData, setChannelData] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [expandedReplies, setExpandedReplies] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';

  useEffect(() => {
    const fetchVideoAndComments = async () => {
      if (!videoId) return;
      setLoading(true);
      setError('');

      if (!apiKey) {
        setError('YouTube API key is not configured.');
        setLoading(false);
        return;
      }

      try {
        // Fetch video details
        const videoRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`
        );
        const videoJson = await videoRes.json();
        
        if (videoJson.items && videoJson.items.length > 0) {
          setVideoData(videoJson.items[0]);
          
          // Fetch channel details
          const channelId = videoJson.items[0].snippet.channelId;
          const channelRes = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
          );
          const channelJson = await channelRes.json();
          if (channelJson.items) {
            setChannelData(channelJson.items[0]);
          }
        } else {
          throw new Error('Video not found.');
        }

        // Fetch comments
        const commentsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&maxResults=20&key=${apiKey}`
        );
        const commentsJson = await commentsRes.json();
        if (commentsJson.items) setComments(commentsJson.items);
        
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading telemetry.');
      } finally {
        setLoading(false);
      }
    };
    fetchVideoAndComments();
  }, [videoId]);

  const toggleReplies = (threadId: string) => {
    setExpandedReplies((prev) => ({ ...prev, [threadId]: !prev[threadId] }));
  };

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
      <p className="text-sm">Decoding matrix data streams...</p>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-slate-950 text-red-400 flex flex-col items-center justify-center gap-4 p-4">
      <p className="text-sm text-center max-w-md">⚠️ Error: {error}</p>
      <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">← Return Home</Link>
    </div>
  );

  const snippet = videoData?.snippet;
  const statistics = videoData?.statistics;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link href="/" className="text-xs text-slate-400 hover:text-red-400 transition-colors inline-flex items-center gap-1.5 mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back Hub
        </Link>
        
        {/* Video Player */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black mb-6 shadow-2xl">
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}`} 
            title="Player" 
            className="w-full h-full border-0" 
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        {/* Video Info */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-6">
          <h1 className="text-xl font-bold text-white mb-3">{snippet?.title}</h1>
          
          {/* Channel Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-4">
            <Link 
              href={`/channel/${snippet?.channelId}`} 
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <img 
                src={channelData?.snippet?.thumbnails?.default?.url} 
                alt={snippet?.channelTitle}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-semibold text-slate-200">{snippet?.channelTitle}</span>
            </Link>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" /> {formatViews(statistics?.viewCount)} views
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" /> {formatViews(statistics?.likeCount)} likes
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> {new Date(snippet?.publishedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Description */}
          {snippet?.description && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {snippet.description}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-800">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${videoId}`);
                alert('📋 Video link copied!');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              <Copy className="w-4 h-4" /> Copy Link
            </button>
            <button 
              onClick={() => {
                window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" /> Open YouTube
            </button>
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: snippet?.title,
                    text: `Check out this video: ${snippet?.title}`,
                    url: `https://www.youtube.com/watch?v=${videoId}`,
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${videoId}`);
                  alert('📋 Video link copied!');
                }
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> Node Conversation Threads ({comments.length})
          </h2>
          
          {comments.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-6">
              {comments.map((thread) => {
                const topComment = thread.snippet?.topLevelComment?.snippet;
                const replies = thread.replies?.comments || [];
                const threadId = thread.id;
                const isExpanded = !!expandedReplies[threadId];

                return (
                  <div key={threadId} className="border-b border-slate-800 pb-4 last:border-0">
                    <div className="flex gap-3 items-start">
                      <img 
                        src={topComment?.authorProfileImageUrl} 
                        alt={topComment?.authorDisplayName} 
                        className="w-8 h-8 rounded-full object-cover" 
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-300">
                            {topComment?.authorDisplayName}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(topComment?.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p 
                          className="text-xs text-slate-300 mt-1" 
                          dangerouslySetInnerHTML={{ __html: topComment?.textDisplay }}
                        />
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-[10px] text-slate-500">
                            👍 {formatViews(topComment?.likeCount)}
                          </span>
                        </div>
                        
                        {/* Replies */}
                        {replies.length > 0 && (
                          <div className="mt-3">
                            <button 
                              onClick={() => toggleReplies(threadId)} 
                              className="text-[11px] text-red-400 hover:text-red-300 transition-colors"
                            >
                              {isExpanded ? '▲ Hide Replies' : `▼ View ${replies.length} Replies`}
                            </button>
                            {isExpanded && (
                              <div className="mt-3 pl-4 border-l-2 border-slate-800 space-y-4">
                                {replies.map((r: any) => (
                                  <div key={r.id} className="flex gap-2 items-start">
                                    <img 
                                      src={r.snippet?.authorProfileImageUrl} 
                                      alt={r.snippet?.authorDisplayName} 
                                      className="w-6 h-6 rounded-full object-cover" 
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-bold text-slate-400">
                                          {r.snippet?.authorDisplayName}
                                        </span>
                                        <span className="text-[10px] text-slate-500">
                                          {new Date(r.snippet?.publishedAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p 
                                        className="text-xs text-slate-400" 
                                        dangerouslySetInnerHTML={{ __html: r.snippet?.textDisplay }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
// app/video/[videoId]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ThumbsUp, Eye, Calendar, Share2, Copy, ExternalLink, MessageCircle, Send } from 'lucide-react';

interface PageProps {
  params: Promise<{ videoId: string }>;
}

export default function VideoPage({ params }: PageProps) {
  const { videoId } = use(params);
  const [videoData, setVideoData] = useState<any>(null);
  const [channelData, setChannelData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');

  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';

  useEffect(() => {
    const fetchVideoData = async () => {
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
      } catch (err: any) {
        setError(err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

  const formatViews = (views: string) => {
    if (!views) return '0';
    const num = parseInt(views, 10);
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const mockComments = [
    { author: 'User_01', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', text: 'This is amazing! 🔥', time: '2 hours ago', likes: 12 },
    { author: 'Analyst_Pro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=analyst', text: 'Great content!', time: '5 hours ago', likes: 8 },
    { author: 'Data_Scientist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=data', text: 'Keep it up! 🙏', time: '1 day ago', likes: 5 }
  ];

  if (loading) return (
    <div className="min-h-screen bg-slate-950 text-slate-400 flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      <p className="text-sm">Loading video...</p>
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
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Video Player */}
        <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={snippet?.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        {/* Video Info */}
        <div className="mt-4">
          <h1 className="text-xl md:text-2xl font-bold text-white">{snippet?.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-400">
            <Link 
              href={`/channel/${snippet?.channelId}`} 
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <img 
                src={channelData?.snippet?.thumbnails?.default?.url} 
                alt={snippet?.channelTitle}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="font-semibold">{snippet?.channelTitle}</span>
            </Link>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" /> {formatViews(statistics?.viewCount)} views
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" /> {formatViews(statistics?.likeCount)} likes
            </span>
          </div>
        </div>

        {/* Description */}
        {snippet?.description && (
          <div className="mt-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
            <p className="text-sm text-slate-300 whitespace-pre-wrap line-clamp-3">
              {snippet.description}
            </p>
            <button className="text-xs text-blue-400 hover:text-blue-300 mt-1">Show more</button>
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
              navigator.share?.({
                title: snippet?.title,
                text: `Check out this video: ${snippet?.title}`,
                url: `https://www.youtube.com/watch?v=${videoId}`,
              }).catch(() => {});
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>

        {/* Comments */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> Comments ({mockComments.length})
          </h3>

          {/* Comment Input */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500"
            />
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-full transition-colors flex items-center gap-1">
              <Send className="w-4 h-4" /> Post
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {mockComments.map((comment, index) => (
              <div key={index} className="flex gap-3">
                <img 
                  src={comment.avatar} 
                  alt={comment.author} 
                  className="w-8 h-8 rounded-full object-cover" 
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{comment.author}</span>
                    <span className="text-[10px] text-slate-500">{comment.time}</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-0.5">{comment.text}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <button className="text-[10px] text-slate-500 hover:text-white transition-colors flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" /> {comment.likes}
                    </button>
                    <button className="text-[10px] text-slate-500 hover:text-white transition-colors">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ videoId: string }>;
}

export default function VideoDetailPage({ params }: PageProps) {
  const { videoId } = use(params);
  const [videoData, setVideoData] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [expandedReplies, setExpandedReplies] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiKey = 'AIzaSyB20PVjQIVoiawwbWKycWXDIOcrdygfsc0';

  useEffect(() => {
    const fetchVideoAndComments = async () => {
      if (!videoId) return;
      setLoading(true);
      try {
        const videoRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`);
        const videoJson = await videoRes.json();
        if (videoJson.items && videoJson.items.length > 0) setVideoData(videoJson.items[0]);

        const commentsRes = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&maxResults=20&key=${apiKey}`);
        const commentsJson = await commentsRes.json();
        if (commentsJson.items) setComments(commentsJson.items);
      } catch (err: any) {
        setError('An error occurred while loading telemetry.');
      } finally {
        setLoading(false);
      }
    };
    fetchVideoAndComments();
  }, [videoId]);

  const toggleReplies = (threadId: string) => {
    setExpandedReplies((prev) => ({ ...prev, [threadId]: !prev[threadId] }));
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-xs">Decoding matrix data streams...</div>;
  if (error) return <div className="min-h-screen bg-slate-950 text-red-400 flex items-center justify-center text-xs">⚠️ Error: {error}</div>;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-xs text-slate-400 hover:text-red-400 block mb-6">← Back Hub</Link>
        
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black mb-6">
          <iframe src={`https://www.youtube.com/embed/${videoId}`} title="Player" className="w-full h-full border-0" allowFullScreen></iframe>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8">
          <h1 className="text-lg font-bold mb-3">{videoData?.snippet?.title}</h1>
          <p className="text-xs text-slate-400 whitespace-pre-wrap bg-slate-950 p-4 rounded-xl">{videoData?.snippet?.description}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">💬 Node Conversation Threads ({comments.length})</h2>
          <div className="space-y-6">
            {comments.map((thread) => {
              const topComment = thread.snippet?.topLevelComment?.snippet;
              const replies = thread.replies?.comments || [];
              const threadId = thread.id;
              const isExpanded = !!expandedReplies[threadId];

              return (
                <div key={threadId} className="border-b border-slate-800 pb-4 last:border-0">
                  <div className="flex gap-3 items-start">
                    <img src={topComment?.authorProfileImageUrl} alt="" className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-slate-300 block mb-1">{topComment?.authorDisplayName}</span>
                      <p className="text-xs text-slate-300" dangerouslySetInnerHTML={{ __html: topComment?.textDisplay }}></p>
                      
                      {replies.length > 0 && (
                        <div className="mt-3">
                          <button onClick={() => toggleReplies(threadId)} className="text-[11px] text-red-400">
                            {isExpanded ? `▲ Hide Replies` : `▼ View ${replies.length} Replies`}
                          </button>
                          {isExpanded && (
                            <div className="mt-3 pl-4 border-l border-slate-800 space-y-4">
                              {replies.map((r: any) => (
                                <div key={r.id} className="flex gap-2 items-start">
                                  <img src={r.snippet?.authorProfileImageUrl} alt="" className="w-6 h-6 rounded-full" />
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-400 block">{r.snippet?.authorDisplayName}</span>
                                    <p className="text-xs text-slate-400" dangerouslySetInnerHTML={{ __html: r.snippet?.textDisplay }}></p>
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
        </div>
      </div>
    </main>
  );
}
// app/SocialPlatform.tsx
'use client';

import AIChatbot from './components/AIChatbot';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Upload, Share2, Trash2, Edit3, PlusCircle, CheckCircle2, User, 
  Shield, Activity, Save, X, Radio, Image as ImageIcon, Users, Smile, 
  LogIn, LogOut, Home, Search, Bell, MessageCircle, Heart, Repeat, 
  MoreHorizontal, Camera, Mail, Copy, Globe, Settings, Power, 
  Eye, EyeOff, UserPlus, UserMinus, Star, Award, Clock, Calendar,
  Filter, ChevronDown, ChevronUp, AlertCircle, Check, Send, ExternalLink,
  Play, ThumbsUp, Link as LinkIcon, Menu
} from 'lucide-react';

// ============================================
// AVATAR SELECTOR COMPONENT
// ============================================
const AvatarSelector = ({ onSelect, currentAvatar }: { onSelect: (avatar: string) => void, currentAvatar?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentAvatar || '');
  
  const presetAvatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=adam',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=anna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=chris',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=ryan',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
        onSelect(base64String);
        setIsOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPresetAvatar = (url: string) => {
    setPreviewUrl(url);
    onSelect(url);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)} className="relative cursor-pointer group">
        {previewUrl ? (
          <img src={previewUrl} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-red-500 object-cover hover:border-red-400 transition-all" />
        ) : (
          <div className="w-20 h-20 rounded-full border-2 border-red-500 bg-slate-800 flex items-center justify-center text-3xl text-slate-400 hover:border-red-400 transition-all">👤</div>
        )}
        <div className="absolute bottom-0 right-0 bg-slate-900 rounded-full p-1 border border-slate-700">
          <Camera className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-24 left-0 bg-slate-900 border border-slate-700 rounded-2xl p-4 w-80 shadow-2xl z-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-white">Choose Avatar</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="mb-4 p-3 bg-slate-800 rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-700 p-2 rounded-lg transition-colors">
              <Upload className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-white">Upload your own image</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
            {fileUpload && <p className="text-[10px] text-green-400 mt-1">✓ {fileUpload.name}</p>}
          </div>
          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
            {presetAvatars.map((avatar, index) => (
              <button key={index} onClick={() => selectPresetAvatar(avatar)} className={`w-14 h-14 rounded-full border-2 transition-all hover:scale-105 ${previewUrl === avatar ? 'border-red-500' : 'border-slate-700 hover:border-slate-500'}`}>
                <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full rounded-full" />
              </button>
            ))}
          </div>
          <button onClick={() => { const randomSeed = Math.random().toString(36).substring(7); const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`; selectPresetAvatar(randomAvatar); }} className="w-full mt-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors">
            🎲 Random Avatar
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// VIDEO PLAYER MODAL
// ============================================
const VideoPlayerModal = ({ video, onClose, onAddToPost, formatViews, activeUser }: { 
  video: any, 
  onClose: () => void,
  onAddToPost: (video: any) => void,
  formatViews: (views: string) => string,
  activeUser: any
}) => {
  if (!video) return null;
  
  const videoId = video.id?.videoId || video.id;
  const snippet = video.snippet;
  const statistics = video.statistics || {};
  
  const mockComments = [
    { author: 'User_01', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', text: 'This is amazing! Thanks for sharing! 🔥', time: '2 hours ago', likes: 12 },
    { author: 'Analyst_Pro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=analyst', text: 'Great content for social network analysis!', time: '5 hours ago', likes: 8 },
    { author: 'Data_Scientist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=data', text: 'Can you make more videos like this? 🙏', time: '1 day ago', likes: 5 }
  ];

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center z-10">
          <h3 className="text-sm font-bold text-white truncate max-w-md">{snippet?.title || 'Video Player'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="p-4">
          <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden">
            <iframe src={`https://www.youtube.com/embed/${videoId}`} title={snippet?.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-bold text-white">{snippet?.title}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-400 flex-wrap">
              <span className="font-semibold text-slate-300">📺 {snippet?.channelTitle}</span>
              <span>•</span>
              <span>👁️ {statistics.viewCount ? formatViews(statistics.viewCount) : 'N/A'} views</span>
              <span>•</span>
              <span>👍 {statistics.likeCount ? formatViews(statistics.likeCount) : 'N/A'} likes</span>
            </div>
            {snippet?.description && (
              <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-300 whitespace-pre-wrap line-clamp-3">{snippet.description}</p>
                <button className="text-xs text-blue-400 hover:text-blue-300 mt-1">Show more</button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-800">
            <button onClick={() => { onAddToPost(video); onClose(); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Add to Post
            </button>
            <button onClick={() => { navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${videoId}`); alert('📋 Video link copied!'); }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2">
              <Copy className="w-4 h-4" /> Copy Link
            </button>
            <button onClick={() => { window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank'); }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Open YouTube
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Comments ({mockComments.length})
            </h4>
            
            <div className="flex gap-3 mb-4">
              <img src={activeUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="" className="w-8 h-8 rounded-full object-cover" />
              <input type="text" placeholder={activeUser?.status === 'Disabled' ? 'Account disabled - Cannot comment' : 'Write a comment...'} disabled={activeUser?.status === 'Disabled'} className={`flex-1 bg-slate-950 border border-slate-800 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 ${activeUser?.status === 'Disabled' ? 'opacity-50 cursor-not-allowed' : ''}`} />
              <button className={`px-4 py-2 text-white text-sm font-bold rounded-full transition-colors ${activeUser?.status === 'Disabled' ? 'bg-slate-700 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`} disabled={activeUser?.status === 'Disabled'}>
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {mockComments.map((comment, index) => (
                <div key={index} className="flex gap-3">
                  <img src={comment.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
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
      </div>
    </div>
  );
};

// ============================================
// TYPES
// ============================================
interface EmojiReactions {
  fire: number;
  heart: number;
  clap: number;
  laugh: number;
}

interface Post {
  id: string;
  videoTitle: string;
  channelTitle: string;
  videoUrl?: string;
  content: string;
  workspaceName: string;
  createdAt: string;
  updatedAt?: string;
  reactions: EmojiReactions;
  reviewImage?: string;
  authorUsername: string;
  authorFullName: string;
  authorAvatar?: string;
  comments: Comment[];
  shares: number;
  views: number;
  isEdited: boolean;
}

interface Comment {
  id: string;
  authorUsername: string;
  authorFullName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  reactions: EmojiReactions;
}

interface UserProfile {
  username: string;
  fullName: string;
  role: string;
  bio: string;
  avatar?: string;
  status: 'Active' | 'Disabled';
  followers: string[];
  following: string[];
  joinedAt: string;
  lastActive: string;
  postsCount: number;
  totalReactions: number;
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function SocialPlatform() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ============================================
  // 1. USER MANAGEMENT STATE
  // ============================================
  const [users, setUsers] = useState<UserProfile[]>([
    {
      username: 'ahmad_sna',
      fullName: 'Ahmad Shahril',
      role: 'Lead Network Analyst',
      bio: 'CSC795 Network Specialist | Analyzing social ecosystems 🌐',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad',
      status: 'Active',
      followers: ['siti_analyst', 'network_pro'],
      following: ['siti_analyst'],
      joinedAt: '2026-01-15',
      lastActive: new Date().toISOString(),
      postsCount: 0,
      totalReactions: 0
    },
    {
      username: 'siti_analyst',
      fullName: 'Siti Nurhaliza',
      role: 'Senior Data Analyst',
      bio: 'Data scientist & social network analyst 📊',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=siti',
      status: 'Active',
      followers: ['ahmad_sna'],
      following: ['ahmad_sna', 'network_pro'],
      joinedAt: '2026-02-01',
      lastActive: new Date().toISOString(),
      postsCount: 0,
      totalReactions: 0
    },
    {
      username: 'network_pro',
      fullName: 'PRO Network',
      role: 'Network Admin',
      bio: 'Professional network management',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pro',
      status: 'Active',
      followers: ['siti_analyst'],
      following: [],
      joinedAt: '2026-01-20',
      lastActive: new Date().toISOString(),
      postsCount: 0,
      totalReactions: 0
    }
  ]);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'post_1',
      videoTitle: 'Social Network Analysis Tutorial',
      channelTitle: 'Network Science',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      content: 'Great tutorial on SNA! Highly recommended for beginners. 🔥',
      workspaceName: 'Network Science Lab',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      reactions: { fire: 5, heart: 3, clap: 2, laugh: 1 },
      reviewImage: '',
      authorUsername: 'ahmad_sna',
      authorFullName: 'Ahmad Shahril',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad',
      comments: [
        {
          id: 'comment_1',
          authorUsername: 'siti_analyst',
          authorFullName: 'Siti Nurhaliza',
          authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=siti',
          content: 'Totally agree! This is gold! ✨',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          reactions: { fire: 2, heart: 1, clap: 0, laugh: 0 }
        }
      ],
      shares: 3,
      views: 120,
      isEdited: false
    },
    {
      id: 'post_2',
      videoTitle: 'Understanding Network Clustering',
      channelTitle: 'Data Science Hub',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      content: 'Mind-blowing insights on network clustering algorithms! 🤯',
      workspaceName: 'Data Science Community',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
      reactions: { fire: 8, heart: 5, clap: 4, laugh: 2 },
      reviewImage: '',
      authorUsername: 'siti_analyst',
      authorFullName: 'Siti Nurhaliza',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=siti',
      comments: [
        {
          id: 'comment_2',
          authorUsername: 'network_pro',
          authorFullName: 'PRO Network',
          authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pro',
          content: 'Can you share the paper reference?',
          createdAt: new Date(Date.now() - 3000000).toISOString(),
          reactions: { fire: 0, heart: 1, clap: 0, laugh: 0 }
        }
      ],
      shares: 7,
      views: 245,
      isEdited: false
    }
  ]);

  const [currentUser, setCurrentUser] = useState<string>('ahmad_sna');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerAvatar, setRegisterAvatar] = useState('');
  const [newUser, setNewUser] = useState<Partial<UserProfile>>({
    username: '',
    fullName: '',
    role: '',
    bio: '',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
  });

  // Post creation states
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState('');
  const [workspaceName, setWorkspaceName] = useState('General');
  const [showCreatePost, setShowCreatePost] = useState(false);

  // ============================================
  // 2. SEARCH SYSTEM STATE
  // ============================================
  const [query, setQuery] = useState('');
  const [contentType, setContentType] = useState('video'); 
  const [sortBy, setSortBy] = useState('relevance'); 
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [error, setError] = useState('');

  // ============================================
  // VIDEO PLAYER STATE
  // ============================================
  const [selectedVideoPlayer, setSelectedVideoPlayer] = useState<any>(null);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);

  // UI states
  const [activeTab, setActiveTab] = useState<'feed' | 'search' | 'profile'>('feed');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState('');
  const [showCommentInput, setShowCommentInput] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [activeEmojiMenu, setActiveEmojiMenu] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile | null>(null);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState('');
  const [selectedUserForShare, setSelectedUserForShare] = useState('');
  const [viewingUserProfile, setViewingUserProfile] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const activeUser = users.find(u => u.username === currentUser)!;

  // ============================================
  // FUNCTION UNTUK GENERATE SHAREABLE LINK
  // ============================================
  const getShareableLink = (type: 'post' | 'user' | 'video' | 'search', id: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams();
    
    switch(type) {
      case 'post':
        params.set('post', id);
        break;
      case 'user':
        params.set('user', id);
        break;
      case 'video':
        params.set('video', id);
        break;
      case 'search':
        params.set('q', id);
        break;
    }
    
    return `${baseUrl}/?${params.toString()}`;
  };

  // ============================================
  // EFFECT UNTUK BACA URL PARAMETERS
  // ============================================
  useEffect(() => {
    const postId = searchParams.get('post');
    const username = searchParams.get('user');
    const videoId = searchParams.get('video');
    const searchQuery = searchParams.get('q');
    const type = searchParams.get('type');
    const sort = searchParams.get('sort');

    if (postId) {
      setTimeout(() => {
        const postElement = document.getElementById(`post-${postId}`);
        if (postElement) {
          postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          postElement.classList.add('ring-2', 'ring-red-500', 'ring-offset-2', 'ring-offset-slate-950');
          setTimeout(() => {
            postElement.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2', 'ring-offset-slate-950');
          }, 3000);
        }
      }, 500);
    }

    if (username) {
      setViewingUserProfile(username);
      setActiveTab('profile');
    }

    if (videoId) {
      if (results?.items) {
        const video = results.items.find((v: any) => v.id?.videoId === videoId);
        if (video) {
          setSelectedVideoPlayer(video);
          setIsVideoPlayerOpen(true);
        }
      }
    }

    if (searchQuery) {
      setQuery(searchQuery);
      setActiveTab('search');
      if (type) setContentType(type);
      if (sort) setSortBy(sort);
      setTimeout(() => {
        executeSearch(searchQuery, type || contentType, sort || sortBy);
      }, 300);
    }
  }, [searchParams]);

  // ============================================
  // LOCAL STORAGE SYNC
  // ============================================
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedQuery = localStorage.getItem('pagenet_query');
    const savedType = localStorage.getItem('pagenet_type');
    const savedSort = localStorage.getItem('pagenet_sort');
    const savedResults = localStorage.getItem('pagenet_results');
    const savedPosts = localStorage.getItem('pagenet_posts');
    const savedUsers = localStorage.getItem('pagenet_users');
    const savedCurrentUser = localStorage.getItem('pagenet_current_user');

    if (savedQuery) setQuery(savedQuery);
    if (savedType) setContentType(savedType);
    if (savedSort) setSortBy(savedSort);
    if (savedResults) {
      try { 
        const parsed = JSON.parse(savedResults);
        setResults(parsed);
        if (parsed.nextPageToken) setNextPageToken(parsed.nextPageToken);
      } catch (e) { console.error(e); }
    }
    if (savedPosts) {
      try { setPosts(JSON.parse(savedPosts)); } catch (e) { console.error(e); }
    }
    if (savedUsers) {
      try { 
        const parsed = JSON.parse(savedUsers);
        const typedUsers = parsed.map((u: any) => ({
          ...u,
          status: u.status === 'Disabled' ? 'Disabled' : 'Active'
        }));
        setUsers(typedUsers); 
      } catch (e) { console.error(e); }
    }
    if (savedCurrentUser) {
      setCurrentUser(savedCurrentUser);
    }
  }, []);

  // ============================================
  // 1. USER MANAGEMENT FUNCTIONS
  // ============================================
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === loginUsername);
    if (user && user.status === 'Active') {
      const updatedUsers = users.map((u): UserProfile => 
        u.username === loginUsername ? { ...u, lastActive: new Date().toISOString() } : u
      );
      setUsers(updatedUsers);
      localStorage.setItem('pagenet_users', JSON.stringify(updatedUsers));
      setCurrentUser(user.username);
      localStorage.setItem('pagenet_current_user', user.username);
      setIsLoginModalOpen(false);
      setLoginUsername('');
      setLoginPassword('');
    } else if (user && user.status === 'Disabled') {
      alert('Account is disabled! Please contact administrator.');
    } else {
      alert('User not found!');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.fullName) {
      alert('Username and full name required!');
      return;
    }
    if (users.some(u => u.username === newUser.username)) {
      alert('Username already exists!');
      return;
    }

    const user: UserProfile = {
      username: newUser.username,
      fullName: newUser.fullName,
      role: newUser.role || 'Member',
      bio: newUser.bio || '',
      avatar: registerAvatar || newUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.username}`,
      status: 'Active',
      followers: [],
      following: [],
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      postsCount: 0,
      totalReactions: 0
    };

    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem('pagenet_users', JSON.stringify(updatedUsers));
    setCurrentUser(user.username);
    localStorage.setItem('pagenet_current_user', user.username);
    setIsRegisterModalOpen(false);
    setNewUser({ username: '', fullName: '', role: '', bio: '' });
    setRegisterAvatar('');
  };

  const handleLogout = () => {
    setCurrentUser('');
    localStorage.removeItem('pagenet_current_user');
  };

  const toggleUserStatus = (username: string) => {
    const updatedUsers = users.map((u): UserProfile => {
      if (u.username === username) {
        return { 
          ...u, 
          status: u.status === 'Active' ? 'Disabled' : 'Active' 
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('pagenet_users', JSON.stringify(updatedUsers));
  };

  const editUserProfile = (username: string, updatedData: Partial<UserProfile>) => {
    const updatedUsers = users.map((u): UserProfile => {
      if (u.username === username) {
        return { ...u, ...updatedData };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('pagenet_users', JSON.stringify(updatedUsers));
  };

  const selfDisableAccount = () => {
    if (activeUser.status === 'Disabled') {
      alert('Your account is already disabled!');
      return;
    }
    
    if (confirm('⚠️ Are you sure you want to DISABLE your own account?\n\nYou will NOT be able to:\n❌ Create new posts\n❌ Comment on posts\n❌ React to posts\n\n✅ Admin can enable your account again.')) {
      const updatedUsers = users.map((u): UserProfile => 
        u.username === currentUser ? { ...u, status: 'Disabled' } : u
      );
      setUsers(updatedUsers);
      localStorage.setItem('pagenet_users', JSON.stringify(updatedUsers));
      alert('✅ Your account has been DISABLED. Contact admin to re-enable.');
    }
  };

  // ============================================
  // 2. POST MANAGEMENT FUNCTIONS
  // ============================================
  const createPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() && !selectedVideo) return;
    if (activeUser.status === 'Disabled') {
      alert('Your account is disabled!');
      return;
    }

    const newPost: Post = {
      id: 'post_' + Date.now(),
      videoTitle: selectedVideo?.snippet?.title || 'Untitled Video',
      channelTitle: selectedVideo?.snippet?.channelTitle || 'Unknown Channel',
      videoUrl: selectedVideo?.id?.videoId ? `https://www.youtube.com/watch?v=${selectedVideo.id.videoId}` : undefined,
      content: postContent,
      workspaceName: workspaceName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reactions: { fire: 0, heart: 0, clap: 0, laugh: 0 },
      reviewImage: postImage || undefined,
      authorUsername: activeUser.username,
      authorFullName: activeUser.fullName,
      authorAvatar: activeUser.avatar,
      comments: [],
      shares: 0,
      views: 0,
      isEdited: false
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('pagenet_posts', JSON.stringify(updatedPosts));
    
    const updatedUsers = users.map((u): UserProfile => 
      u.username === activeUser.username ? { ...u, postsCount: u.postsCount + 1 } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('pagenet_users', JSON.stringify(updatedUsers));
    
    setPostContent('');
    setPostImage('');
    setSelectedVideo(null);
    setShowCreatePost(false);
  };

  const editPost = (postId: string) => {
    const updated = posts.map((p): Post => {
      if (p.id === postId) {
        return { 
          ...p, 
          content: editContent, 
          reviewImage: editImage || p.reviewImage,
          updatedAt: new Date().toISOString(),
          isEdited: true 
        };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem('pagenet_posts', JSON.stringify(updated));
    setEditingPostId(null);
    setEditContent('');
    setEditImage('');
  };

  const deletePost = (postId: string) => {
    if (confirm('Delete this post?')) {
      const postToDelete = posts.find(p => p.id === postId);
      if (postToDelete) {
        const updatedUsers = users.map((u): UserProfile => 
          u.username === postToDelete.authorUsername ? { ...u, postsCount: Math.max(0, u.postsCount - 1) } : u
        );
        setUsers(updatedUsers);
        localStorage.setItem('pagenet_users', JSON.stringify(updatedUsers));
      }
      const updatedPosts = posts.filter(p => p.id !== postId);
      setPosts(updatedPosts);
      localStorage.setItem('pagenet_posts', JSON.stringify(updatedPosts));
    }
  };

  const addReaction = (postId: string, type: keyof EmojiReactions) => {
    if (activeUser.status === 'Disabled') {
      alert('Your account is disabled! Cannot react.');
      return;
    }
    const updated = posts.map((p): Post => {
      if (p.id === postId) {
        const reactions = p.reactions || { fire: 0, heart: 0, clap: 0, laugh: 0 };
        return {
          ...p,
          reactions: {
            ...reactions,
            [type]: (reactions[type] || 0) + 1
          }
        };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem('pagenet_posts', JSON.stringify(updated));
    setActiveEmojiMenu(null);
  };

  const addComment = (postId: string) => {
    if (activeUser.status === 'Disabled') {
      alert('Your account is disabled! Cannot comment.');
      return;
    }
    if (!commentText.trim()) return;
    
    const updated = posts.map((p): Post => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: 'comment_' + Date.now(),
              authorUsername: activeUser.username,
              authorFullName: activeUser.fullName,
              authorAvatar: activeUser.avatar,
              content: commentText,
              createdAt: new Date().toISOString(),
              reactions: { fire: 0, heart: 0, clap: 0, laugh: 0 }
            }
          ]
        };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem('pagenet_posts', JSON.stringify(updated));
    setCommentText('');
    setShowCommentInput(null);
  };

  const sharePost = (postId: string, method: 'copy' | 'email' | 'internal' = 'copy') => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const shareText = `📊 "${post.content}"\n🎬 ${post.videoTitle}\n✍️ by @${post.authorUsername} on PageNet+`;
    
    if (method === 'copy') {
      navigator.clipboard.writeText(shareText);
      alert('📋 Post copied to clipboard!');
    } else if (method === 'email') {
      const subject = encodeURIComponent(`PageNet+ Review: ${post.videoTitle}`);
      const body = encodeURIComponent(shareText + '\n\nView full post at: ' + window.location.origin);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    } else if (method === 'internal' && selectedUserForShare) {
      alert(`✅ Shared with @${selectedUserForShare}`);
      setSelectedUserForShare('');
      setShareMessage('');
      setShowShareModal(null);
    }
    
    const updated = posts.map((p): Post => {
      if (p.id === postId) {
        return { ...p, shares: p.shares + 1 };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem('pagenet_posts', JSON.stringify(updated));
  };

  const followUser = (username: string) => {
    if (username === currentUser) return;
    
    const updatedUsers = users.map((u): UserProfile => {
      if (u.username === currentUser) {
        const isFollowing = u.following.includes(username);
        return {
          ...u,
          following: isFollowing 
            ? u.following.filter(f => f !== username)
            : [...u.following, username]
        };
      }
      if (u.username === username) {
        const isFollower = u.followers.includes(currentUser);
        return {
          ...u,
          followers: isFollower
            ? u.followers.filter(f => f !== currentUser)
            : [...u.followers, currentUser]
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('pagenet_users', JSON.stringify(updatedUsers));
  };

  // ============================================
  // 3. INTEGRATION MANAGEMENT FUNCTIONS
  // ============================================
  const shareToExternalPlatform = (postId: string, platform: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const shareText = encodeURIComponent(`📊 ${post.content}\n🎬 ${post.videoTitle}\n✍️ by @${post.authorUsername} on PageNet+`);
    const url = encodeURIComponent(window.location.origin);
    
    let shareUrl = '';
    switch(platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${shareText}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${shareText}%20${url}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${shareText}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
    
    const updated = posts.map((p): Post => {
      if (p.id === postId) {
        return { ...p, shares: p.shares + 1 };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem('pagenet_posts', JSON.stringify(updated));
  };

  // ============================================
  // SEARCH ENGINE LOGIC
  // ============================================
  const executeSearch = async (currentQuery: string, currentType: string, currentSort: string) => {
    if (!currentQuery.trim()) return;
    setLoading(true);
    setError('');
    setNextPageToken(null);
    
    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(currentQuery)}&type=${currentType}&order=${currentSort}`);
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || `Server returned status ${res.status}`);
      
      setResults(data);
      setNextPageToken(data.nextPageToken);
      
      localStorage.setItem('pagenet_query', currentQuery);
      localStorage.setItem('pagenet_type', currentType);
      localStorage.setItem('pagenet_sort', currentSort);
      localStorage.setItem('pagenet_results', JSON.stringify(data));
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreResults = async () => {
    if (!nextPageToken || loadingMore) return;
    setLoadingMore(true);

    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}&type=${contentType}&order=${sortBy}&pageToken=${nextPageToken}`);
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || `Server status ${res.status}`);

      const updatedItems = [...(results?.items || []), ...(data.items || [])];
      const updatedResults = { items: updatedItems, nextPageToken: data.nextPageToken };

      setResults(updatedResults);
      setNextPageToken(data.nextPageToken);
      localStorage.setItem('pagenet_results', JSON.stringify(updatedResults));
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (query.trim()) {
      executeSearch(query, contentType, sortBy);
    }
  }, [contentType, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}&type=${contentType}&sort=${sortBy}`);
    }
    executeSearch(query, contentType, sortBy);
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults(null);
    setNextPageToken(null);
    setContentType('video');
    setSortBy('relevance');
    localStorage.removeItem('pagenet_query');
    localStorage.removeItem('pagenet_type');
    localStorage.removeItem('pagenet_sort');
    localStorage.removeItem('pagenet_results');
    router.push('/');
  };

  const handleAddToWorkspaceClick = (item: any) => {
    setSelectedVideo(item);
    setShowCreatePost(true);
    setActiveTab('feed');
    if (item.id?.videoId) {
      router.push(`/?video=${item.id.videoId}`);
    }
    setTimeout(() => {
      document.getElementById('create-post-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const viewUserProfile = (username: string) => {
    setViewingUserProfile(username);
    setActiveTab('profile');
    router.push(`/?user=${username}`);
  };

  const viewVideo = (video: any) => {
    if (video.id?.videoId) {
      setSelectedVideoPlayer(video);
      setIsVideoPlayerOpen(true);
      router.push(`/?video=${video.id.videoId}`);
    }
  };

  // ============================================
  // RENDER HELPERS
  // ============================================
  const formatTime = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    if (days < 30) return `${Math.floor(days / 7)}w`;
    return new Date(isoString).toLocaleDateString();
  };

  const formatViews = (views: string) => {
    if (!views) return '0';
    const num = parseInt(views, 10);
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTrendingPosts = () => {
    return [...posts].sort((a, b) => {
      const aTotal = Object.values(a.reactions).reduce((sum, val) => sum + val, 0) + a.comments.length + a.shares;
      const bTotal = Object.values(b.reactions).reduce((sum, val) => sum + val, 0) + b.comments.length + b.shares;
      return bTotal - aTotal;
    }).slice(0, 5);
  };

  const getRecommendedUsers = () => {
    const following = activeUser.following;
    return users.filter(u => 
      u.username !== currentUser && 
      !following.includes(u.username) &&
      u.status === 'Active'
    ).slice(0, 5);
  };

  const getTotalReactions = (post: Post) => {
    return Object.values(post.reactions).reduce((sum, val) => sum + val, 0);
  };

  const getSNAOverview = () => {
    if (!results?.items || results.items.length === 0) return null;
    let totalVolume = 0;
    let highAuthorityHub = 'N/A';
    let maxMetric = 0;

    results.items.forEach((item: any) => {
      const targetViews = parseInt(item.statistics?.viewCount || item.statistics?.subscriberCount || '0', 10);
      totalVolume += targetViews;
      if (targetViews > maxMetric) {
        maxMetric = targetViews;
        highAuthorityHub = item.snippet?.channelTitle || item.snippet?.title || 'Unknown';
      }
    });

    return { totalVolume, highAuthorityHub, densityFactor: (results.items.length * 1.4).toFixed(1) };
  };

  const sna = getSNAOverview();

  // ============================================
  // RENDER
  // ============================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-white">PageNet<span className="text-red-500">+</span></h1>
            <p className="text-slate-400 text-xs mt-1">Social Network Analysis Platform</p>
          </div>
          
          <div className="space-y-3">
            <button onClick={() => setIsLoginModalOpen(true)} className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors text-sm">
              <LogIn className="w-4 h-4 inline mr-2" /> Login
            </button>
            <button onClick={() => setIsRegisterModalOpen(true)} className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors text-sm">
              <UserPlus className="w-4 h-4 inline mr-2" /> Register
            </button>
          </div>

          {/* Login Modal */}
          {isLoginModalOpen && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full">
                <h2 className="text-lg font-bold text-white mb-4">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <input type="text" placeholder="Username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg text-white focus:outline-none focus:border-red-500 text-sm" required />
                  <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg text-white focus:outline-none focus:border-red-500 text-sm" required />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg transition-colors text-sm">Login</button>
                    <button type="button" onClick={() => setIsLoginModalOpen(false)} className="flex-1 bg-slate-800 text-slate-400 py-2.5 rounded-lg hover:bg-slate-700 transition-colors text-sm">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Register Modal */}
          {isRegisterModalOpen && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold text-white mb-4">Create Account</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl">
                    <AvatarSelector onSelect={(avatar) => { setNewUser({...newUser, avatar}); setRegisterAvatar(avatar); }} currentAvatar={registerAvatar || newUser.avatar} />
                    <div>
                      <p className="text-xs text-slate-400">Click avatar to change</p>
                      <p className="text-[10px] text-slate-500">Upload photo or choose preset</p>
                    </div>
                  </div>

                  <input type="text" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg text-white focus:outline-none focus:border-red-500 text-sm" required />
                  <input type="text" placeholder="Full Name" value={newUser.fullName} onChange={(e) => setNewUser({...newUser, fullName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg text-white focus:outline-none focus:border-red-500 text-sm" required />
                  <input type="text" placeholder="Role" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg text-white focus:outline-none focus:border-red-500 text-sm" />
                  <textarea placeholder="Bio" value={newUser.bio} onChange={(e) => setNewUser({...newUser, bio: e.target.value})} className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg text-white focus:outline-none focus:border-red-500 text-sm" rows={3} />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg transition-colors text-sm">Register</button>
                    <button type="button" onClick={() => setIsRegisterModalOpen(false)} className="flex-1 bg-slate-800 text-slate-400 py-2.5 rounded-lg hover:bg-slate-700 transition-colors text-sm">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN APP (LOGGED IN) - MOBILE FIRST
  // ============================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 md:pb-0">
      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-40 md:hidden">
        <div className="flex items-center justify-around py-2 px-2">
          <button
            onClick={() => { setActiveTab('feed'); setViewingUserProfile(null); router.push('/'); }}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
              activeTab === 'feed' ? 'text-red-500' : 'text-slate-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Feed</span>
          </button>
          <button
            onClick={() => { setActiveTab('search'); }}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
              activeTab === 'search' ? 'text-red-500' : 'text-slate-400'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px]">Search</span>
          </button>
          <button
            onClick={() => { setActiveTab('profile'); setViewingUserProfile(null); }}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
              activeTab === 'profile' ? 'text-red-500' : 'text-slate-400'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">Profile</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-slate-400"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px]">Logout</span>
          </button>
        </div>
      </nav>

      {/* ===== DESKTOP TOP NAV ===== */}
      <nav className="hidden md:flex bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 w-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveTab('feed'); setViewingUserProfile(null); router.push('/'); }}>
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" fill="#FF0000"/>
              <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF"/>
            </svg>
            <span className="text-xl font-extrabold text-white">PageNet<span className="text-red-500">+</span></span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1">
              <button onClick={() => { setActiveTab('feed'); setViewingUserProfile(null); router.push('/'); }} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'feed' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                <Home className="w-4 h-4 inline mr-1" /> Feed
              </button>
              <button onClick={() => { setActiveTab('search'); }} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'search' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                <Search className="w-4 h-4 inline mr-1" /> Search
              </button>
              <button onClick={() => { setActiveTab('profile'); setViewingUserProfile(null); }} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'profile' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                <User className="w-4 h-4 inline mr-1" /> Profile
              </button>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 text-xs font-medium transition-colors">
              <LogOut className="w-4 h-4 inline" /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ===== REST OF THE UI (Feed, Search, Profile) ===== */}
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6">
        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <div className="flex flex-col md:grid md:grid-cols-4 gap-4 md:gap-6">
            {/* Left Sidebar - Desktop only */}
            <div className="hidden md:block md:col-span-1 space-y-4">
              {/* User Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <img src={activeUser.avatar} alt="" className="w-12 h-12 rounded-full border-2 border-red-500 object-cover" />
                  <div>
                    <p className="font-bold text-sm text-white">{activeUser.fullName}</p>
                    <p className="text-xs text-slate-400">@{activeUser.username}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-3 text-xs">
                  <div><span className="font-bold text-white">{activeUser.postsCount}</span> <span className="text-slate-500">Posts</span></div>
                  <div><span className="font-bold text-white">{activeUser.followers.length}</span> <span className="text-slate-500">Followers</span></div>
                  <div><span className="font-bold text-white">{activeUser.following.length}</span> <span className="text-slate-500">Following</span></div>
                </div>
              </div>

              {/* Trending */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">🔥 Trending</h3>
                {getTrendingPosts().map(post => (
                  <div key={post.id} className="mb-2 pb-2 border-b border-slate-800 last:border-0">
                    <p className="text-xs text-slate-300 line-clamp-2">{post.content}</p>
                    <p className="text-[10px] text-slate-500 mt-1">by @{post.authorUsername}</p>
                  </div>
                ))}
              </div>

              {/* Who to follow */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">👥 Who to follow</h3>
                {getRecommendedUsers().map(user => (
                  <div key={user.username} className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src={user.avatar} alt="" className="w-6 h-6 rounded-full" />
                      <span className="text-xs text-white cursor-pointer hover:text-red-400" onClick={() => viewUserProfile(user.username)}>
                        @{user.username}
                      </span>
                    </div>
                    <button onClick={() => followUser(user.username)} className="text-[10px] bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white font-bold">
                      {activeUser.following.includes(user.username) ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile User Card */}
            <div className="md:hidden bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-3">
              <div className="flex items-center gap-3">
                <img src={activeUser.avatar} alt="" className="w-12 h-12 rounded-full border-2 border-red-500" />
                <div className="flex-1">
                  <p className="font-bold text-sm text-white">{activeUser.fullName}</p>
                  <p className="text-xs text-slate-400">@{activeUser.username}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeUser.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {activeUser.status}
                </span>
              </div>
            </div>

            {/* Main Feed */}
            <div className="md:col-span-2 w-full">
              {/* Create Post Button */}
              <button
                onClick={() => setShowCreatePost(!showCreatePost)}
                className={`w-full bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3 md:p-4 mb-4 text-left transition-all ${activeUser.status === 'Disabled' ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={activeUser.status === 'Disabled'}
              >
                <div className="flex items-center gap-3">
                  <img src={activeUser.avatar} alt="" className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
                  <span className="text-slate-400 text-sm">
                    {activeUser.status === 'Disabled' ? 'Account Disabled' : "What's on your mind?"}
                  </span>
                </div>
              </button>

              {/* Create Post Form */}
              {showCreatePost && activeUser.status === 'Active' && (
                <div className="bg-slate-900 border-2 border-red-500/30 rounded-2xl p-4 mb-6">
                  <form onSubmit={createPost} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={activeUser.avatar} alt="" className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <p className="font-bold text-sm text-white">{activeUser.fullName}</p>
                        <p className="text-xs text-slate-500">@{activeUser.username}</p>
                      </div>
                    </div>

                    <textarea
                      placeholder="Write your review..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white min-h-[80px] focus:outline-none"
                      required
                    />

                    {selectedVideo && (
                      <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
                        <p className="text-xs text-slate-300 line-clamp-1 flex-1">🎬 {selectedVideo.snippet?.title}</p>
                        <button type="button" onClick={() => setSelectedVideo(null)} className="text-xs text-red-400 hover:text-red-300">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        placeholder="Workspace name"
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        className="flex-1 min-w-[120px] bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                      <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs text-slate-300 transition-colors">
                        <ImageIcon className="w-4 h-4 inline" /> Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setPostImage(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {postImage && (
                      <div className="relative w-20 h-14">
                        <img src={postImage} alt="" className="w-full h-full object-cover rounded-lg border border-slate-800" />
                        <button type="button" onClick={() => setPostImage('')} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5">
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                        <Send className="w-4 h-4 inline mr-1" /> Post
                      </button>
                      <button type="button" onClick={() => setShowCreatePost(false)} className="bg-slate-800 text-slate-400 px-4 py-2 rounded-xl text-sm hover:bg-slate-700 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Feed Posts */}
              <div className="space-y-4">
                {posts.map(post => {
                  const author = users.find(u => u.username === post.authorUsername);
                  const isAuthorDisabled = author?.status === 'Disabled';
                  
                  return (
                    <div key={post.id} id={`post-${post.id}`} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all">
                      {/* Author */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <img 
                            src={post.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorUsername}`} 
                            alt="" 
                            className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-red-500 transition-all flex-shrink-0"
                            onClick={() => viewUserProfile(post.authorUsername)}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-sm text-white cursor-pointer hover:text-red-400 transition-colors truncate" onClick={() => viewUserProfile(post.authorUsername)}>
                                {post.authorFullName}
                              </p>
                              <p className="text-xs text-slate-400 truncate">@{post.authorUsername}</p>
                              {post.authorUsername === currentUser && (
                                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">You</span>
                              )}
                              {post.isEdited && <span className="text-[10px] text-slate-500">(edited)</span>}
                              {isAuthorDisabled && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Disabled</span>}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 flex-wrap">
                              <span>{formatTime(post.createdAt)}</span>
                              <span>•</span>
                              <span>📁 {post.workspaceName}</span>
                            </div>
                          </div>
                        </div>
                        {post.authorUsername === currentUser && activeUser.status === 'Active' && (
                          <div className="flex gap-1 flex-shrink-0 ml-2">
                            <button onClick={() => { setEditingPostId(post.id); setEditContent(post.content); setEditImage(post.reviewImage || ''); }} className="text-slate-500 hover:text-amber-400 text-xs p-1 rounded hover:bg-slate-800">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deletePost(post.id)} className="text-slate-500 hover:text-red-400 text-xs p-1 rounded hover:bg-slate-800">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      {editingPostId === post.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none"
                            rows={3}
                          />
                          <div>
                            <label className="text-xs text-slate-400">Change image:</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => setEditImage(reader.result as string);
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="text-xs text-slate-400 block mt-1"
                            />
                            {editImage && <img src={editImage} alt="" className="w-20 h-14 object-cover rounded-lg border border-slate-800 mt-2" />}
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => editPost(post.id)} className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-1.5 rounded-lg">
                              <Save className="w-3 h-3 inline mr-1" /> Save
                            </button>
                            <button onClick={() => setEditingPostId(null)} className="bg-slate-800 text-slate-400 text-xs px-4 py-1.5 rounded-lg hover:bg-slate-700">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-slate-200 mb-2 break-words">{post.content}</p>
                          {post.reviewImage && (
                            <img src={post.reviewImage} alt="" className="w-full max-h-48 object-cover rounded-xl border border-slate-800 mb-2" />
                          )}
                          <div className="text-xs text-slate-500 bg-slate-950/50 p-2 rounded-lg flex flex-wrap items-center justify-between gap-2">
                            <span className="truncate">🎬 {post.videoTitle}</span>
                            {post.videoUrl && (
                              <a href={post.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 flex-shrink-0">
                                <ExternalLink className="w-3 h-3" /> Watch
                              </a>
                            )}
                          </div>
                        </>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-800 relative">
                        <button
                          onClick={() => {
                            if (activeUser.status === 'Disabled') {
                              alert('Your account is disabled! Cannot react.');
                              return;
                            }
                            setActiveEmojiMenu(activeEmojiMenu === post.id ? null : post.id);
                          }}
                          className={`text-slate-400 hover:text-white text-xs flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${activeUser.status === 'Disabled' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800'}`}
                          disabled={activeUser.status === 'Disabled'}
                        >
                          <Smile className="w-4 h-4" /> React
                        </button>
                        {activeEmojiMenu === post.id && (
                          <div className="absolute bottom-full left-0 mb-2 bg-slate-950 border border-slate-700 rounded-xl p-2 flex gap-2 z-10 shadow-xl">
                            <button onClick={() => addReaction(post.id, 'fire')} className="hover:scale-125 transition-transform text-xl">🔥</button>
                            <button onClick={() => addReaction(post.id, 'heart')} className="hover:scale-125 transition-transform text-xl">❤️</button>
                            <button onClick={() => addReaction(post.id, 'clap')} className="hover:scale-125 transition-transform text-xl">👏</button>
                            <button onClick={() => addReaction(post.id, 'laugh')} className="hover:scale-125 transition-transform text-xl">😂</button>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <span>🔥{post.reactions.fire}</span>
                          <span>❤️{post.reactions.heart}</span>
                          <span>👏{post.reactions.clap}</span>
                          <span>😂{post.reactions.laugh}</span>
                        </div>

                        <button
                          onClick={() => {
                            if (activeUser.status === 'Disabled') {
                              alert('Your account is disabled! Cannot comment.');
                              return;
                            }
                            setShowCommentInput(showCommentInput === post.id ? null : post.id);
                          }}
                          className={`text-slate-400 hover:text-white text-xs flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${activeUser.status === 'Disabled' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800'}`}
                          disabled={activeUser.status === 'Disabled'}
                        >
                          <MessageCircle className="w-4 h-4" /> {post.comments.length}
                        </button>

                        <button onClick={() => setShowShareModal(showShareModal === post.id ? null : post.id)} className="text-slate-400 hover:text-white text-xs flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors">
                          <Share2 className="w-4 h-4" /> {post.shares}
                        </button>

                        {/* Share Modal */}
                        {showShareModal === post.id && (
                          <div className="absolute right-0 top-full mt-2 bg-slate-950 border border-slate-700 rounded-xl p-3 w-56 z-10 shadow-xl">
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-slate-400">Share</h4>
                              <div className="flex gap-1.5 flex-wrap">
                                <button onClick={() => shareToExternalPlatform(post.id, 'twitter')} className="p-1.5 bg-slate-800 rounded-lg hover:bg-slate-700 text-sm">🐦</button>
                                <button onClick={() => shareToExternalPlatform(post.id, 'facebook')} className="p-1.5 bg-slate-800 rounded-lg hover:bg-slate-700 text-sm">📘</button>
                                <button onClick={() => shareToExternalPlatform(post.id, 'whatsapp')} className="p-1.5 bg-slate-800 rounded-lg hover:bg-slate-700 text-sm">💬</button>
                                <button onClick={() => shareToExternalPlatform(post.id, 'telegram')} className="p-1.5 bg-slate-800 rounded-lg hover:bg-slate-700 text-sm">✈️</button>
                              </div>
                              <div className="flex gap-1">
                                <button onClick={() => sharePost(post.id, 'copy')} className="flex-1 text-xs bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded-lg">
                                  <Copy className="w-3 h-3 inline" /> Copy
                                </button>
                                <button 
                                  onClick={() => {
                                    const link = getShareableLink('post', post.id);
                                    navigator.clipboard.writeText(link);
                                    alert('📋 Link copied!');
                                  }}
                                  className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-lg"
                                >
                                  <LinkIcon className="w-3 h-3 inline" /> Link
                                </button>
                              </div>
                              <button onClick={() => setShowShareModal(null)} className="w-full text-xs text-slate-500 hover:text-slate-400">Close</button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Comments */}
                      {showCommentInput === post.id && (
                        <div className="mt-3 space-y-2">
                          {post.comments.map(comment => (
                            <div key={comment.id} className="bg-slate-950 rounded-lg p-2 border border-slate-800">
                              <div className="flex items-center gap-2">
                                <img src={comment.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.authorUsername}`} alt="" className="w-5 h-5 rounded-full" />
                                <span className="font-bold text-xs text-white cursor-pointer hover:text-red-400" onClick={() => viewUserProfile(comment.authorUsername)}>
                                  {comment.authorFullName}
                                </span>
                                <span className="text-[10px] text-slate-500">@{comment.authorUsername}</span>
                              </div>
                              <p className="text-xs text-slate-300 ml-7 break-words">{comment.content}</p>
                            </div>
                          ))}
                          {activeUser.status === 'Active' ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addComment(post.id)}
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                              />
                              <button onClick={() => addComment(post.id)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg">
                                Reply
                              </button>
                            </div>
                          ) : (
                            <p className="text-[10px] text-red-400 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Account disabled
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Sidebar - Desktop only */}
            <div className="hidden md:block md:col-span-1 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">📊 Analytics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Posts</span><span className="text-white font-bold">{posts.length}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Reactions</span><span className="text-white font-bold">{posts.reduce((sum, p) => sum + getTotalReactions(p), 0)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Comments</span><span className="text-white font-bold">{posts.reduce((sum, p) => sum + p.comments.length, 0)}</span></div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">👥 Active Users</h3>
                {users.filter(u => u.status === 'Active').slice(0, 5).map(user => (
                  <div key={user.username} className="flex items-center gap-2 py-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <img src={user.avatar} alt="" className="w-5 h-5 rounded-full cursor-pointer" onClick={() => viewUserProfile(user.username)} />
                    <span className="text-xs text-slate-300 cursor-pointer hover:text-white" onClick={() => viewUserProfile(user.username)}>
                      @{user.username}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SEARCH TAB */}
        {activeTab === 'search' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6">
              <h2 className="text-lg font-bold text-white mb-4">🔍 Search YouTube</h2>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search videos, channels..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
                />
                <button onClick={handleSearchSubmit} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors whitespace-nowrap">
                  {loading ? '...' : 'Search'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4 text-xs">
                <div className="flex gap-1 bg-slate-950 rounded-lg p-1">
                  {['video', 'channel', 'playlist'].map(type => (
                    <button key={type} onClick={() => setContentType(type)} className={`px-2 py-1 rounded-lg transition-colors ${contentType === type ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'}`}>
                      {type}
                    </button>
                  ))}
                </div>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 text-xs focus:outline-none">
                  <option value="relevance">Relevance</option>
                  <option value="date">Latest</option>
                  <option value="viewCount">Most Viewed</option>
                </select>
              </div>

              {error && <div className="p-3 bg-red-950/30 text-red-400 text-xs rounded-xl text-center mb-4">Error: {error}</div>}
              {loading && <div className="text-center py-6 text-slate-400 text-sm">Loading...</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results?.items?.map((item: any, index: number) => {
                  const id = item.id?.videoId || item.id?.channelId || item.id?.playlistId || (typeof item.id === 'string' ? item.id : '');
                  const snippet = item.snippet;
                  if (!id) return null;

                  return (
                    <div 
                      key={`${id}-${index}`} 
                      className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all cursor-pointer group"
                      onClick={() => {
                        if (item.id?.videoId) {
                          router.push(`/video/${item.id.videoId}`);
                        } else if (item.id?.channelId) {
                          router.push(`/channel/${item.id.channelId}`);
                        }
                      }}
                    >
                      <div className="relative aspect-video bg-slate-950 overflow-hidden">
                        <img src={snippet?.thumbnails?.medium?.url || snippet?.thumbnails?.high?.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        {item.id?.videoId && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                              <Play className="w-6 h-6 text-white ml-1" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-bold text-white line-clamp-2 group-hover:text-red-400 transition-colors">
                          {snippet?.title}
                        </p>
                        <p 
                          className="text-xs text-slate-400 cursor-pointer hover:text-red-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (snippet?.channelId) {
                              router.push(`/channel/${snippet.channelId}`);
                            }
                          }}
                        >
                          {snippet?.channelTitle}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[10px] text-slate-500">
                            👁️ {item.statistics?.viewCount ? formatViews(item.statistics.viewCount) : 'N/A'}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (activeUser.status === 'Disabled') {
                                alert('Your account is disabled!');
                                return;
                              }
                              if (item.id?.videoId) {
                                handleAddToWorkspaceClick(item);
                              }
                            }}
                            className={`py-1 px-2 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
                              activeUser.status === 'Disabled' || !item.id?.videoId
                                ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                                : 'bg-red-600 hover:bg-red-700'
                            }`}
                            disabled={activeUser.status === 'Disabled' || !item.id?.videoId}
                          >
                            <PlusCircle className="w-3 h-3" /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {results?.items?.length === 0 && query && !loading && (
                <p className="text-center text-slate-400 py-6 text-sm">No results found</p>
              )}

              {nextPageToken && (
                <div className="mt-6 text-center">
                  <button onClick={loadMoreResults} disabled={loadingMore} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold rounded-xl text-slate-300 transition-all uppercase disabled:opacity-50">
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto">
            {viewingUserProfile && viewingUserProfile !== currentUser ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6">
                <button onClick={() => { setViewingUserProfile(null); router.push('/'); }} className="text-slate-400 hover:text-white text-sm mb-4 flex items-center gap-1">
                  ← Back
                </button>
                
                {(() => {
                  const viewedUser = users.find(u => u.username === viewingUserProfile);
                  if (!viewedUser) return <p className="text-slate-400 text-sm">User not found</p>;
                  
                  return (
                    <>
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
                        <img src={viewedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${viewedUser.username}`} alt="" className="w-20 h-20 rounded-full border-4 border-red-500" />
                        <div className="flex-1 text-center sm:text-left">
                          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                            <h2 className="text-xl font-bold text-white">{viewedUser.fullName}</h2>
                            <span className="text-sm text-slate-400">@{viewedUser.username}</span>
                          </div>
                          <p className="text-sm text-slate-300 mt-1">{viewedUser.role}</p>
                          <p className="text-sm text-slate-400 mt-1">{viewedUser.bio}</p>
                          <div className="flex flex-wrap gap-4 mt-3 text-sm justify-center sm:justify-start">
                            <div><span className="font-bold text-white">{viewedUser.postsCount}</span> <span className="text-slate-500">Posts</span></div>
                            <div><span className="font-bold text-white">{viewedUser.followers.length}</span> <span className="text-slate-500">Followers</span></div>
                            <div><span className="font-bold text-white">{viewedUser.following.length}</span> <span className="text-slate-500">Following</span></div>
                          </div>
                          <div className="mt-3">
                            {viewedUser.status === 'Active' && viewedUser.username !== currentUser && (
                              <button onClick={() => followUser(viewedUser.username)} className={`text-xs font-bold px-4 py-1.5 rounded-full transition-colors ${activeUser.following.includes(viewedUser.username) ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-600 text-white hover:bg-red-700'}`}>
                                {activeUser.following.includes(viewedUser.username) ? 'Unfollow' : 'Follow'}
                              </button>
                            )}
                            {viewedUser.status === 'Disabled' && (
                              <span className="text-xs text-red-400 font-medium">🔴 Account Disabled</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-sm font-bold text-slate-300 mb-4">Posts by @{viewedUser.username}</h3>
                        {posts.filter(p => p.authorUsername === viewedUser.username).length === 0 ? (
                          <p className="text-slate-400 text-sm">No posts yet.</p>
                        ) : (
                          <div className="grid grid-cols-1 gap-3">
                            {posts.filter(p => p.authorUsername === viewedUser.username).map(post => (
                              <div key={post.id} className="bg-slate-950 rounded-xl p-3 border border-slate-800">
                                <p className="text-sm text-slate-200 line-clamp-2">{post.content}</p>
                                <div className="flex gap-3 mt-2 text-xs text-slate-500">
                                  <span>❤️ {getTotalReactions(post)}</span>
                                  <span>💬 {post.comments.length}</span>
                                  <span>🔁 {post.shares}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : editingProfile && tempProfile ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6">
                <h3 className="text-lg font-bold text-white mb-4">Edit Profile</h3>
                <div className="flex flex-col items-center gap-4 mb-4">
                  <AvatarSelector onSelect={(avatar) => setTempProfile({...tempProfile, avatar})} currentAvatar={tempProfile.avatar} />
                  <button onClick={() => setEditingProfile(false)} className="text-xs text-slate-400 hover:text-white">Cancel</button>
                </div>
                <input type="text" placeholder="Full Name" value={tempProfile.fullName} onChange={(e) => setTempProfile({...tempProfile, fullName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-white focus:outline-none mb-3 text-sm" />
                <input type="text" placeholder="Role" value={tempProfile.role} onChange={(e) => setTempProfile({...tempProfile, role: e.target.value})} className="w-full bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-white focus:outline-none mb-3 text-sm" />
                <textarea placeholder="Bio" value={tempProfile.bio} onChange={(e) => setTempProfile({...tempProfile, bio: e.target.value})} className="w-full bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-white focus:outline-none mb-3 text-sm" rows={3} />
                <button onClick={() => { editUserProfile(currentUser, tempProfile); setEditingProfile(false); setTempProfile(null); }} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-bold transition-colors text-sm">
                  <Save className="w-4 h-4 inline mr-2" /> Save Changes
                </button>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="relative">
                    <img src={activeUser.avatar} alt="" className="w-20 h-20 rounded-full border-4 border-red-500" />
                    <button 
                      onClick={() => { if (activeUser.status === 'Disabled') { alert('Account disabled!'); return; } setTempProfile({...activeUser}); setEditingProfile(true); }} 
                      className="absolute bottom-0 right-0 bg-slate-900 rounded-full p-1.5 border border-slate-700 hover:bg-slate-800"
                      disabled={activeUser.status === 'Disabled'}
                    >
                      <Camera className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                      <h2 className="text-xl font-bold text-white">{activeUser.fullName}</h2>
                      <span className="text-sm text-slate-400">@{activeUser.username}</span>
                    </div>
                    <p className="text-sm text-slate-300 mt-1">{activeUser.role}</p>
                    <p className="text-sm text-slate-400 mt-1">{activeUser.bio}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm justify-center sm:justify-start">
                      <div><span className="font-bold text-white">{activeUser.postsCount}</span> <span className="text-slate-500">Posts</span></div>
                      <div><span className="font-bold text-white">{activeUser.followers.length}</span> <span className="text-slate-500">Followers</span></div>
                      <div><span className="font-bold text-white">{activeUser.following.length}</span> <span className="text-slate-500">Following</span></div>
                    </div>
                    
                    {activeUser.status === 'Active' && (
                      <button onClick={selfDisableAccount} className="mt-3 text-xs bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-xl font-bold border border-red-500/30 flex items-center gap-2">
                        <UserMinus className="w-3.5 h-3.5" /> Disable Account
                      </button>
                    )}
                    {activeUser.status === 'Disabled' && (
                      <div className="mt-3 p-3 bg-red-950/30 border border-red-800 rounded-xl">
                        <p className="text-xs text-red-400 font-medium flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" /> Account DISABLED
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-bold text-slate-300 mb-4">Your Posts</h3>
                  {posts.filter(p => p.authorUsername === currentUser).length === 0 ? (
                    <p className="text-slate-400 text-sm">No posts yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {posts.filter(p => p.authorUsername === currentUser).map(post => (
                        <div key={post.id} className="bg-slate-950 rounded-xl p-3 border border-slate-800">
                          <p className="text-sm text-slate-200 line-clamp-2">{post.content}</p>
                          <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                            <span>❤️ {getTotalReactions(post)}</span>
                            <span>💬 {post.comments.length}</span>
                            <span>🔁 {post.shares}</span>
                            {post.isEdited && <span className="text-amber-400">edited</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== VIDEO PLAYER MODAL ===== */}
      {isVideoPlayerOpen && selectedVideoPlayer && (
        <VideoPlayerModal
          video={selectedVideoPlayer}
          onClose={() => { setIsVideoPlayerOpen(false); setSelectedVideoPlayer(null); router.push('/'); }}
          onAddToPost={handleAddToWorkspaceClick}
          formatViews={formatViews}
          activeUser={activeUser}
        />
      )}
    
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 md:pb-0">
      {/* ... semua UI sedia ada */}

      {/* 🤖 AI Assistant */}
      <AIChatbot />
    </div>
  );
    </div>
  );
}
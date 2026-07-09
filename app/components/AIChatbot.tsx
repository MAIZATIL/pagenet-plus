// app/components/AIChatbot.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Minimize2, Maximize2, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Hi! I\'m your PageNet+ AI Assistant. I can help you with:\n\n• 📝 Writing review posts\n• 🔍 Finding relevant content\n• 📊 Social network analysis tips\n• 💡 Content suggestions\n\nAsk me anything!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    const lower = userMessage.toLowerCase();

    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    if (lower.includes('hello') || lower.includes('hi')) {
      return "Hello! 👋 How can I help you with your social network analysis today?";
    }

    if (lower.includes('help') || lower.includes('what can you do')) {
      return `I can help you with:

📝 **Writing Reviews**: Get suggestions for your video reviews
🔍 **Content Discovery**: Find trending topics in social network analysis
📊 **Analysis Tips**: Learn about SNA concepts and metrics
💡 **Ideas**: Get inspiration for your next post

Just tell me what you need!`;
    }

    if (lower.includes('review') || lower.includes('post')) {
      return `📝 **Review Writing Tips**:

1. **Start with a hook** - Grab attention with an interesting fact or question
2. **Describe the content** - Summarize what the video is about
3. **Share your opinion** - What did you like? What could be improved?
4. **Add context** - How does this relate to social network analysis?
5. **End with a question** - Encourage discussion with your audience

Example: "🔥 This video on network clustering is a game-changer! The way they explain community detection algorithms is so clear. What's your favorite clustering technique?"`;
    }

    if (lower.includes('social network') || lower.includes('sna')) {
      return `🌐 **Social Network Analysis Concepts**:

**Key Metrics**:
• **Centrality** - Who's the most connected?
• **Clustering** - How dense are the connections?
• **Bridges** - Who connects different groups?
• **Influence** - Who has the most impact?

**Popular Algorithms**:
• PageRank (Google)
• Louvain (Community Detection)
• Girvan-Newman (Edge Betweenness)

Need more details on any of these?`;
    }

    if (lower.includes('trending') || lower.includes('popular')) {
      return `🔥 **Trending Topics in SNA right now**:

1. **AI-powered network analysis** - Using machine learning for pattern detection
2. **Social media influence mapping** - Understanding digital ecosystems
3. **Fake news detection** - Network-based misinformation tracking
4. **Community detection in large-scale networks** - Scalable algorithms
5. **Temporal network analysis** - How networks evolve over time

Want me to elaborate on any of these?`;
    }

    if (lower.includes('thank')) {
      return "You're welcome! 😊 Happy to help. Anything else you need?";
    }

    return `🤔 That's an interesting question! I'm here to help with:

• Writing and improving review posts
• Understanding social network analysis concepts
• Finding relevant content and trends
• Generating ideas for your next post

Could you tell me more specifically what you're looking for?`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAIResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Button floating - naikkan ke atas (bottom-20 instead of bottom-6)
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 z-50 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white rounded-full p-3 md:p-4 shadow-2xl transition-all hover:scale-110 group"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse"></span>
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isMinimized 
        ? 'bottom-6 right-6 w-[280px] h-[60px]' 
        : 'bottom-2 right-2 w-[calc(100vw-16px)] h-[80vh] max-h-[600px] md:bottom-4 md:right-4 md:w-[380px] md:h-[600px] md:max-h-[650px]'
    }`}>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-2.5 md:p-3 border-b border-slate-800 bg-gradient-to-r from-red-600/20 to-purple-600/20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-r from-red-500 to-purple-500 rounded-full flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
            </div>
            <div>
              <span className="text-xs md:text-sm font-bold text-white">AI Assistant</span>
              <span className="text-[8px] md:text-[10px] text-green-400 block -mt-0.5">● Online</span>
            </div>
          </div>
          <div className="flex items-center gap-0.5 md:gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 md:p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Minimize2 className="w-3.5 h-3.5 md:w-4 md:h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 md:p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 md:px-4 py-2 md:py-2.5 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white'
                        : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    <p className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    <span className="text-[8px] md:text-[10px] opacity-50 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 rounded-2xl px-3 md:px-4 py-2 md:py-2.5">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-2.5 md:p-3 border-t border-slate-800 bg-slate-950/50">
              <div className="flex gap-1.5 md:gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask AI..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white rounded-xl px-3 md:px-4 py-1.5 md:py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
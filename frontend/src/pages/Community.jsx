import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Bookmark, 
  Flame, 
  Trophy, 
  TrendingUp, 
  Plus, 
  Search, 
  Send,
  Code,
  Sparkles
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';

const Community = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [newPostText, setNewPostText] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Alex Chen',
      role: 'Level 8 Engineer',
      avatar: 'A',
      time: '2 hours ago',
      content: 'Just optimized Merge Sort vs Quick Sort in the Benchmark Center! Quick Sort proved 2.4x faster on random arrays, but Merge Sort won on nearly sorted datasets.',
      likes: 24,
      comments: 7,
      tag: 'Benchmarking'
    },
    {
      id: 2,
      author: 'Priya Sharma',
      role: 'Level 5 Explorer',
      avatar: 'P',
      time: '4 hours ago',
      content: 'Can someone explain why Dijkstra’s algorithm fails on graphs with negative edge weights? Is Bellman-Ford always the best alternative?',
      likes: 18,
      comments: 12,
      tag: 'Graphs'
    }
  ]);

  const leaderboard = [
    { rank: 1, name: 'Elena Rostova', xp: '4,850 XP', level: 12 },
    { rank: 2, name: 'Alex Chen', xp: '4,120 XP', level: 10 },
    { rank: 3, name: 'Marcus Vance', xp: '3,900 XP', level: 9 },
  ];

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    const post = {
      id: Date.now(),
      author: 'You',
      role: 'Level 4 Explorer',
      avatar: 'U',
      time: 'Just now',
      content: newPostText,
      likes: 0,
      comments: 0,
      tag: 'General'
    };
    setPosts([post, ...posts]);
    setNewPostText('');
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2">

        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <Users className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold font-poppins text-gray-900">Community & Discussions</h1>
            </div>
            <p className="text-sm text-gray-500 font-inter mt-1">
              Connect with fellow developers, discuss algorithm complexities, and share benchmark insights.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            {['feed', 'discussions', 'groups'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold font-poppins capitalize transition-all ${
                  activeTab === tab ? 'bg-white text-primary shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Feed Column */}
          <div className="lg:col-span-8 space-y-6">

            {/* Post Creator Box */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-accent text-white font-bold flex items-center justify-center">
                  U
                </div>
                <textarea
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Share an algorithm insight, benchmark result, or question..."
                  className="w-full bg-gray-50/70 border border-gray-100 rounded-2xl p-3.5 text-xs font-inter text-gray-900 focus:outline-none focus:border-primary resize-none h-20"
                />
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                <span className="text-[11px] text-gray-400 font-inter">Supports Markdown code formatting</span>
                <Button onClick={handleCreatePost} variant="primary" className="py-2 text-xs">
                  <Send className="w-3.5 h-3.5 mr-1" /> Post
                </Button>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary font-bold flex items-center justify-center font-poppins">
                        {post.avatar}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold font-poppins text-gray-900">{post.author}</h4>
                        <span className="text-[11px] text-gray-400 font-inter">{post.role} • {post.time}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold font-mono">
                      {post.tag}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 font-inter leading-relaxed">{post.content}</p>

                  <div className="flex items-center gap-6 pt-3 border-t border-gray-50 text-xs font-medium text-gray-400">
                    <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <ThumbsUp className="w-4 h-4" /> {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <MessageSquare className="w-4 h-4" /> {post.comments}
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Sidebar Widget Column */}
          <div className="lg:col-span-4 space-y-6">

            {/* Leaderboard Widget */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-poppins text-gray-900 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" /> Leaderboard
                </h3>
                <span className="text-xs text-primary font-semibold font-inter">Global</span>
              </div>

              <div className="space-y-3">
                {leaderboard.map((user) => (
                  <div key={user.rank} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/60 border border-gray-100 text-xs">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold font-mono w-4 text-center ${user.rank === 1 ? 'text-amber-500' : 'text-gray-400'}`}>#{user.rank}</span>
                      <div>
                        <p className="font-semibold font-poppins text-gray-900">{user.name}</p>
                        <p className="text-[10px] text-gray-400">Level {user.level}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-primary">{user.xp}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
};

export default Community;

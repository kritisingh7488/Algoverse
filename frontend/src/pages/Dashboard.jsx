import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Trophy, 
  Target, 
  BookOpen, 
  ArrowUpRight, 
  Play, 
  Clock, 
  CheckCircle, 
  Sparkles, 
  Layers, 
  BarChart2, 
  ChevronRight 
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import useAuthStore from '../store/authStore';
import Button from '../components/common/Button';

const Dashboard = () => {
  const { user } = useAuthStore();

  const streakDays = [true, true, true, true, false, false, false];

  const recentAlgorithms = [
    { name: 'Merge Sort', type: 'Sorting', progress: 85, time: '2 hours ago' },
    { name: 'Binary Search Tree', type: 'Trees', progress: 60, time: 'Yesterday' },
    { name: 'Breadth First Search', type: 'Graphs', progress: 40, time: '3 days ago' },
  ];

  const recommendedLabs = [
    { title: 'Quick Sort vs Merge Sort', category: 'Sorting Benchmark', icon: BarChart2, difficulty: 'Medium', color: 'from-purple-500/10 to-primary/10' },
    { title: 'AVL Tree Rotations', category: 'Self-Balancing Trees', icon: Layers, difficulty: 'Hard', color: 'from-pink-500/10 to-accent/10' },
    { title: 'Dijkstra’s Shortest Path', category: 'Graph Algorithms', icon: Sparkles, difficulty: 'Hard', color: 'from-blue-500/10 to-indigo-500/10' }
  ];

  return (
    <AppLayout>
      <div className="space-y-8 py-4">

        {/* Welcome Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-primary via-[#8E44AD] to-[#7C3AED] p-8 sm:p-10 text-white shadow-xl shadow-primary/20 overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold font-poppins text-white">
              <Flame className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span>4 Day Study Streak Active!</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-poppins tracking-tight">
              Welcome back, {user?.fullName || 'Algorithm Engineer'}! 👋
            </h1>
            <p className="text-white/90 text-sm font-inter leading-relaxed">
              You are 75% away from completing your weekly DSA goal. Keep visualizer sessions active to earn your next achievement badge.
            </p>
            <div className="pt-3 flex flex-wrap gap-3">
              <Link to="/labs/sorting">
                <Button className="bg-white text-primary hover:bg-white/90 px-5 py-2.5 text-sm font-semibold shadow-md">
                  Continue Sorting Lab
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Top Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* XP Card */}
          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 font-inter">Total XP</p>
              <h3 className="text-2xl font-bold font-poppins text-gray-900">1,250 XP</h3>
              <p className="text-[11px] text-emerald-600 font-medium">+150 XP this week</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-primary flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
          </div>

          {/* Level Card */}
          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 font-inter">Current Level</p>
              <h3 className="text-2xl font-bold font-poppins text-gray-900">Level 4</h3>
              <p className="text-[11px] text-gray-400 font-medium">Explorer</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-accent flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          {/* Daily Goal Card */}
          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 font-inter">Daily Goal</p>
              <h3 className="text-2xl font-bold font-poppins text-gray-900">3 / 4 Labs</h3>
              <p className="text-[11px] text-emerald-600 font-medium">1 lab remaining</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
          </div>

          {/* Streak Card */}
          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 font-inter">Streak</p>
              <h3 className="text-2xl font-bold font-poppins text-gray-900">4 Days</h3>
              <div className="flex items-center gap-1 pt-1">
                {streakDays.map((active, i) => (
                  <span
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${
                      active ? 'bg-orange-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Middle Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Recent Activity & Continue Learning */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-poppins text-gray-900">Continue Learning</h2>
                <Link to="/playground" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  View All Labs <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentAlgorithms.map((algo, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 font-poppins">{algo.name}</span>
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-md">{algo.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{algo.time}</span>
                      </div>
                    </div>

                    <div className="w-full sm:w-48 space-y-1">
                      <div className="flex justify-between text-xs font-medium text-gray-500">
                        <span>Completion</span>
                        <span>{algo.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${algo.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Recommended Labs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-xs space-y-6">
              <h2 className="text-xl font-bold font-poppins text-gray-900">Recommended</h2>

              <div className="space-y-4">
                {recommendedLabs.map((lab, idx) => {
                  const Icon = lab.icon;
                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 space-y-3 group hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${lab.color} text-primary flex items-center justify-center`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold font-poppins text-gray-900 group-hover:text-primary transition-colors">{lab.title}</h4>
                          <p className="text-xs text-gray-400 font-inter">{lab.category}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>
    </AppLayout>
  );
};

export default Dashboard;

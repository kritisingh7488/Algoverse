import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Trophy, 
  Flame, 
  Award, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  BarChart2, 
  Edit 
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import useAuthStore from '../store/authStore';
import Button from '../components/common/Button';

const Profile = () => {
  const { user } = useAuthStore();

  const achievements = [
    { title: 'Sorting Specialist', desc: 'Completed all 5 sorting algorithms in laboratory', icon: BarChart2, date: 'Jul 2026' },
    { title: 'Graph Explorer', desc: 'Executed Dijkstra and BFS shortest path traversals', icon: Layers, date: 'Jul 2026' },
    { title: '4 Day Streak', desc: 'Maintained consecutive daily learning sessions', icon: Flame, date: 'Active' }
  ];

  return (
    <AppLayout>
      <div className="space-y-8 py-2">

        {/* Profile Banner & Info Header */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="h-36 bg-gradient-to-r from-primary via-[#8E44AD] to-[#7C3AED] relative" />
          <div className="p-8 relative pt-0 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-14">
              <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-xl">
                <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-primary to-accent text-white text-3xl font-extrabold flex items-center justify-center font-poppins">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold font-poppins text-gray-900">{user?.fullName || 'User Profile'}</h1>
                <p className="text-xs text-gray-500 font-inter flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" /> {user?.email}
                </p>
              </div>
            </div>

            <Button variant="outline" className="text-xs py-2">
              <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit Profile
            </Button>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-primary flex items-center justify-center font-bold">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 font-inter">Total XP</p>
              <h3 className="text-xl font-bold font-poppins text-gray-900">1,250 XP</h3>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-accent flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 font-inter">Current Rank</p>
              <h3 className="text-xl font-bold font-poppins text-gray-900">Level 4 Explorer</h3>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 font-inter">Study Streak</p>
              <h3 className="text-xl font-bold font-poppins text-gray-900">4 Days Active</h3>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <h2 className="text-lg font-bold font-poppins text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" /> Unlocked Achievements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((ach, i) => {
              const Icon = ach.icon;
              return (
                <div key={i} className="p-5 rounded-2xl bg-gray-50/60 border border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{ach.date}</span>
                  </div>
                  <h4 className="text-sm font-semibold font-poppins text-gray-900">{ach.title}</h4>
                  <p className="text-xs text-gray-500 font-inter leading-relaxed">{ach.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default Profile;

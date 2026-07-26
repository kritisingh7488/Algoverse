import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Trophy, 
  Flame, 
  Award, 
  Sparkles, 
  Layers, 
  BarChart2, 
  Edit 
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import useAuthStore from '../store/authStore';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import MascotRole from '../components/mascots/MascotRole';

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

        {/* Profile Banner & Header */}
        <Card className="p-0 overflow-hidden border-2 border-borderTheme">
          <div className="h-36 bg-cardAccent relative" />
          <div className="p-8 relative pt-0 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-14">
              <div className="w-24 h-24 rounded-card bg-card p-1.5 shadow-medium border-2 border-borderTheme">
                <div className="w-full h-full rounded-2xl bg-primary text-white text-3xl font-heading font-bold flex items-center justify-center">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-heading font-bold text-textPrimary">{user?.fullName || 'User Profile'}</h1>
                <p className="text-xs font-body text-textSecondary flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-textSecondary" /> {user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <MascotRole role="companion" activity="star" dialogue="Great progress!" className="w-20 h-20" />
              <Button variant="outline" size="sm">
                <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit Profile
              </Button>
            </div>
          </div>
        </Card>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card hover className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center font-bold border border-secondary/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider">Total XP</p>
              <h3 className="text-xl font-heading font-bold text-textPrimary">1,250 XP</h3>
            </div>
          </Card>

          <Card hover className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-bold border border-primary/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider">Current Rank</p>
              <h3 className="text-xl font-heading font-bold text-textPrimary">Level 4 Explorer</h3>
            </div>
          </Card>

          <Card hover className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 text-primary flex items-center justify-center font-bold border border-accent/40">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider">Study Streak</p>
              <h3 className="text-xl font-heading font-bold text-textPrimary">4 Days Active</h3>
            </div>
          </Card>
        </div>

        {/* Achievements Section */}
        <Card className="space-y-6">
          <h2 className="text-lg font-heading font-bold text-textPrimary flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" /> Unlocked Achievements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((ach, i) => {
              const Icon = ach.icon;
              return (
                <div key={i} className="p-5 rounded-2xl bg-surface border-2 border-borderTheme space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center border border-primary/30">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="success">{ach.date}</Badge>
                  </div>
                  <h4 className="text-sm font-heading font-bold text-textPrimary">{ach.title}</h4>
                  <p className="text-xs font-body text-textSecondary leading-relaxed">{ach.desc}</p>
                </div>
              );
            })}
          </div>
        </Card>

      </div>
    </AppLayout>
  );
};

export default Profile;

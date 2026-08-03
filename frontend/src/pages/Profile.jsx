import React, { useState } from 'react';
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
  Edit,
  CheckCircle2,
  X,
  RefreshCw
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import useAuthStore from '../store/authStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const Profile = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.fullName || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');

  const xp = user?.xp || 0;
  const level = user?.level || 1;
  const streakCount = user?.streakCount || 0;
  const achievements = user?.achievements?.length > 0 ? user.achievements : [
    { title: 'Welcome to AlgoVerse!', desc: 'Started your algorithm journey', icon: Sparkles, date: 'Today' }
  ];

  const handleRandomizeAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    setEditAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
  };

  const handleSaveProfile = async () => {
    const res = await updateProfile({ fullName: editName, avatar: editAvatar });
    if (res.success) {
      setIsEditing(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-4 py-2">

        {/* Profile Banner & Header */}
        <Card className="p-0 overflow-hidden border-2 border-borderTheme">
          <div className="h-36 bg-cardAccent relative" />
          <div className="p-8 relative pt-0 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-14">
              <div className="relative group">
                <div className="w-24 h-24 rounded-card bg-card p-1.5 shadow-medium border-[1.5px] border-borderTheme overflow-hidden flex items-center justify-center">
                  {(isEditing ? editAvatar : user?.avatar) ? (
                    <img 
                      src={isEditing ? editAvatar : user?.avatar} 
                      alt="Avatar" 
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-primary text-white text-3xl font-heading font-bold flex items-center justify-center">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <button 
                    onClick={handleRandomizeAvatar}
                    className="absolute -right-2 -bottom-2 bg-primary text-white p-2 rounded-xl shadow-medium border border-primary/30 hover:scale-105 transition-transform"
                    title="Randomize Avatar"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="space-y-2 w-full max-w-xs">
                {isEditing ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Display Name"
                    className="font-heading font-bold"
                  />
                ) : (
                  <h1 className="text-2xl font-heading font-bold text-textPrimary">{user?.fullName || 'User Profile'}</h1>
                )}
                
                <p className="text-xs font-body text-textSecondary flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-textSecondary" /> {user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => {
                    setIsEditing(false);
                    setEditName(user?.fullName || '');
                    setEditAvatar(user?.avatar || '');
                  }}>
                    <X className="w-3.5 h-3.5 mr-1.5" /> Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSaveProfile} isLoading={isLoading}>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Save
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit Profile
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card hover className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center font-bold border border-secondary/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider">Total XP</p>
              <h3 className="text-xl font-heading font-bold text-textPrimary">{xp.toLocaleString()} XP</h3>
            </div>
          </Card>

          <Card hover className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-bold border border-primary/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider">Current Rank</p>
              <h3 className="text-xl font-heading font-bold text-textPrimary">Level {level} Explorer</h3>
            </div>
          </Card>

          <Card hover className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 text-primary flex items-center justify-center font-bold border border-accent/40">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider">Study Streak</p>
              <h3 className="text-xl font-heading font-bold text-textPrimary">{streakCount} Days Active</h3>
            </div>
          </Card>
        </div>

        {/* Achievements Section */}
        <Card className="space-y-4">
          <h2 className="text-lg font-heading font-bold text-textPrimary flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" /> Unlocked Achievements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((ach, i) => {
              // Map icon string from DB to an actual Lucide component, fallback to Award
              let Icon = Award;
              if (typeof ach.icon === 'function' || typeof ach.icon === 'object') {
                Icon = ach.icon; // For local fallback
              } else if (ach.icon === 'BarChart2') Icon = BarChart2;
              else if (ach.icon === 'Layers') Icon = Layers;
              else if (ach.icon === 'Flame') Icon = Flame;
              else if (ach.icon === 'Sparkles') Icon = Sparkles;

              return (
                <div key={i} className="p-4 rounded-2xl bg-surface border-[1.5px] border-borderTheme space-y-3">
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

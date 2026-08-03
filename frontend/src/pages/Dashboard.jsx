import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  Trophy, 
  Target, 
  BookOpen, 
  Clock, 
  Sparkles, 
  Layers, 
  BarChart2, 
  ChevronRight 
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import useAuthStore from '../store/authStore';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import StickyNote from '../components/notebook/StickyNote';
import { SparkleStar } from '../components/notebook/PaperClip';

const Dashboard = () => {
  const { user } = useAuthStore();

  const streakDays = user?.streakDays || [false, false, false, false, false, false, false];
  const xp = user?.xp || 0;
  const level = user?.level || 1;
  const streakCount = user?.streakCount || 0;
  const recentAlgorithms = user?.recentActivity?.length > 0 ? user.recentActivity : [];

  const recommendedLabs = [
    { title: 'Quick Sort vs Merge Sort', category: 'Sorting Benchmark', icon: BarChart2, path: '/benchmarks' },
    { title: 'AVL Tree Rotations', category: 'Self-Balancing Trees', icon: Layers, path: '/labs/tree' },
    { title: 'Dijkstra’s Shortest Path', category: 'Graph Algorithms', icon: Sparkles, path: '/labs/graph' }
  ];

  return (
    <AppLayout>
      <div className="space-y-5 py-2">

        {/* Welcome Banner Card with Mascot Companion */}
        <Card className="relative overflow-hidden bg-cardAccent border-[1.5px] border-borderTheme p-5 sm:p-6 shadow-medium">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-borderTheme text-xs font-heading font-bold text-textPrimary shadow-xs">
                <Flame className="w-4 h-4 text-warning fill-warning" />
                <span>4 Day Study Streak Active!</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-textPrimary tracking-tight">
                Welcome back, {user?.fullName || 'Algorithm Explorer'}! 🎓
              </h1>
              <p className="text-textSecondary text-sm font-body leading-relaxed">
                You're making steady progress on your algorithm learning roadmap! Complete today's laboratory exercise to earn your next achievement badge.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link to="/labs/sorting">
                  <Button variant="primary" size="md">
                    Continue Sorting Lab <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/playground">
                  <Button variant="outline" size="md">
                    Data Structure Playground
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* XP Card */}
          <Card hover className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider">Total XP</p>
              <h3 className="text-2xl font-heading font-bold text-textPrimary">{xp.toLocaleString()} XP</h3>
              <p className="text-[10px] text-success font-body font-bold">Keep learning to earn more!</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center border border-secondary/30">
              <Trophy className="w-6 h-6" />
            </div>
          </Card>

          {/* Level Card */}
          <Card hover className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider">Current Level</p>
              <h3 className="text-2xl font-heading font-bold text-textPrimary">Level {level}</h3>
              <p className="text-[10px] text-primary font-body font-bold">Algorithm Explorer</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center border border-primary/30">
              <Sparkles className="w-6 h-6" />
            </div>
          </Card>

          {/* Daily Goal Card */}
          <Card hover className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider">Daily Goal</p>
              <h3 className="text-2xl font-heading font-bold text-textPrimary">3 / 4 Labs</h3>
              <p className="text-[10px] text-success font-body font-bold">1 lab remaining</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-warning/20 text-warning flex items-center justify-center border border-warning/30">
              <Target className="w-6 h-6" />
            </div>
          </Card>

          {/* Streak Card */}
          <Card hover className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider">Streak</p>
              <h3 className="text-2xl font-heading font-bold text-textPrimary">{streakCount} Days</h3>
              <div className="flex items-center gap-1.5 pt-1">
                {streakDays.map((active, i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      active ? 'bg-primary' : 'bg-surface border border-borderTheme'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-accent/20 text-primary flex items-center justify-center border border-accent/40">
              <Flame className="w-6 h-6" />
            </div>
          </Card>

        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Recent Activity */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading font-bold text-textPrimary flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Continue Learning
                </h2>
                <Link to="/playground">
                  <Button variant="outline" size="sm">
                    View All Labs <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

                {recentAlgorithms.length === 0 ? (
                  <div className="p-5 text-center text-textSecondary font-body bg-surface rounded-2xl border-[1.5px] border-dashed border-borderTheme">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No recent activity yet. Start exploring algorithms!</p>
                  </div>
                ) : (
                  recentAlgorithms.map((algo, i) => (
                    <Link key={i} to={algo.path}>
                      <div className="p-4 rounded-2xl bg-surface border-[1.5px] border-borderTheme hover:border-primary transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3 group">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-heading font-bold text-textPrimary group-hover:text-primary transition-colors">{algo.name}</span>
                            <Badge variant="primary">{algo.type}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-body text-textSecondary">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{algo.time}</span>
                          </div>
                        </div>

                        <div className="w-full sm:w-48 space-y-1">
                          <div className="flex justify-between text-xs font-body font-bold text-textSecondary">
                            <span>Completion</span>
                            <span className="text-primary">{algo.progress}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-card rounded-full overflow-hidden border border-borderTheme">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${algo.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
            </Card>
          </div>

          {/* Right Column: Sticky Note Note Pad & Recommendations */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Notebook Sticky Note */}
            <StickyNote color="yellow">
              <h3 className="font-heading font-bold text-sm mb-1 flex items-center gap-1.5">
                <SparkleStar className="w-4 h-4 text-warning" /> Daily Study Tip
              </h3>
              <p className="text-xs font-body leading-relaxed">
                When analyzing algorithm efficiency, always consider both worst-case time complexity and auxiliary space overhead!
              </p>
            </StickyNote>

            {/* Recommended Labs */}
            <Card className="space-y-4">
              <h2 className="text-lg font-heading font-bold text-textPrimary">Recommended Practice</h2>
              <div className="space-y-3">
                {recommendedLabs.map((lab, idx) => {
                  const Icon = lab.icon;
                  return (
                    <Link key={idx} to={lab.path} className="block">
                      <div className="p-3.5 rounded-2xl bg-surface border-[1.5px] border-borderTheme hover:border-primary transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-heading font-bold text-textPrimary group-hover:text-primary transition-colors">{lab.title}</h4>
                            <p className="text-[10px] font-body text-textSecondary">{lab.category}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-textSecondary group-hover:text-primary" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>

          </div>

        </div>

      </div>
    </AppLayout>
  );
};

export default Dashboard;

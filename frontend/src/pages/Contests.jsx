import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Clock, 
  Users, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  CheckCircle 
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';

const Contests = () => {
  const contests = [
    {
      id: 1,
      title: 'AlgoVerse Weekly Contest 42',
      status: 'Active',
      timeRemaining: '01h 45m 20s',
      problems: 4,
      participants: 1240,
      reward: '500 XP + Winner Badge',
      color: 'border-emerald-500/30 bg-emerald-50/20'
    },
    {
      id: 2,
      title: 'Dynamic Programming Sprint',
      status: 'Upcoming',
      timeRemaining: 'Starts in 2 days',
      problems: 5,
      participants: 680,
      reward: '800 XP + DP Master Badge',
      color: 'border-primary/20 bg-purple-50/20'
    },
    {
      id: 3,
      title: 'Graph Algorithms Showdown',
      status: 'Past',
      timeRemaining: 'Ended Yesterday',
      problems: 4,
      participants: 2100,
      reward: 'Completed',
      color: 'border-gray-200 bg-white'
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6 py-2">

        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <Trophy className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold font-poppins text-gray-900">Algorithm Contests</h1>
            </div>
            <p className="text-sm text-gray-500 font-inter mt-1">
              Test your speed, time complexity accuracy, and problem solving skills in timed contests.
            </p>
          </div>
        </div>

        {/* Contests List */}
        <div className="space-y-4">
          {contests.map((c) => (
            <div key={c.id} className={`p-6 rounded-3xl border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${c.color}`}>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    c.status === 'Active' ? 'bg-emerald-500 text-white animate-pulse' : c.status === 'Upcoming' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {c.status}
                  </span>
                  <h3 className="text-lg font-bold font-poppins text-gray-900">{c.title}</h3>
                </div>

                <div className="flex items-center gap-6 text-xs text-gray-500 font-inter">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> {c.timeRemaining}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-gray-400" /> {c.participants} Registered</span>
                  <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-accent" /> {c.reward}</span>
                </div>
              </div>

              <div>
                {c.status === 'Active' ? (
                  <Button variant="primary" className="px-6 py-2.5 text-xs shadow-md shadow-primary/20">
                    Enter Contest &rarr;
                  </Button>
                ) : c.status === 'Upcoming' ? (
                  <Button variant="outline" className="px-6 py-2.5 text-xs">
                    Register Now
                  </Button>
                ) : (
                  <Button variant="ghost" className="px-6 py-2.5 text-xs text-gray-400" disabled>
                    View Standings
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </AppLayout>
  );
};

export default Contests;

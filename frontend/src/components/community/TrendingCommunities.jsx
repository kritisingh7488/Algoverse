import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Users, Plus, Check } from 'lucide-react';
import Card from '../common/Card';

export const TrendingCommunities = ({
  communities = [],
  joinedIds = [],
  onToggleJoin
}) => {
  const navigate = useNavigate();

  // Filter trending communities sorted by trendingRank
  const trendingList = communities
    .filter(c => c.isTrending || c.trendingRank)
    .sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99))
    .slice(0, 5);

  if (trendingList.length === 0) return null;

  const getRankBadgeStyle = (index) => {
    switch (index) {
      case 0:
        return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 1:
        return 'bg-slate-400/20 text-slate-500 dark:text-slate-300 border-slate-400/30';
      case 2:
        return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      default:
        return 'bg-surface text-textSecondary border-borderTheme';
    }
  };

  return (
    <Card className="bg-card border-[1.5px] border-borderTheme p-4 sm:p-5 shadow-soft space-y-3.5">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-borderTheme">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-warning/15 text-warning border border-warning/30">
            <Flame className="w-4 h-4 fill-warning" />
          </div>
          <div>
            <h3 className="text-sm font-heading font-bold text-textPrimary">
              Trending This Week
            </h3>
            <p className="text-[11px] text-textSecondary font-body">
              Fastest growing study guilds
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {trendingList.map((comm, idx) => {
          const isJoined = joinedIds.includes(comm.id);
          const rank = idx + 1;

          return (
            <div
              key={comm.id}
              onClick={() => navigate(`/community/${comm.id || comm.slug}`)}
              className="group p-2.5 rounded-xl bg-surface/60 hover:bg-surface border border-borderTheme/70 hover:border-primary/40 transition-all flex items-center justify-between gap-2.5 cursor-pointer"
            >
              {/* Rank + Icon + Info */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-heading font-bold shrink-0 ${getRankBadgeStyle(idx)}`}>
                  {rank}
                </span>

                <span className="text-lg shrink-0">{comm.icon || '💬'}</span>

                <div className="min-w-0">
                  <h4 className="text-xs font-heading font-bold text-textPrimary group-hover:text-primary transition-colors truncate">
                    {comm.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-textSecondary font-body">
                    <span className="truncate">{comm.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 shrink-0">
                      <Users className="w-2.5 h-2.5 text-secondary" />
                      {(comm.membersCount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleJoin) onToggleJoin(comm.id);
                }}
                className={`p-1.5 rounded-lg border text-xs font-heading font-bold transition-all shrink-0 ${
                  isJoined
                    ? 'bg-card text-success border-borderTheme hover:bg-danger/10 hover:text-danger'
                    : 'bg-primary text-white border-primary hover:bg-primary-hover shadow-xs'
                }`}
                title={isJoined ? 'Joined' : 'Join'}
              >
                {isJoined ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default TrendingCommunities;

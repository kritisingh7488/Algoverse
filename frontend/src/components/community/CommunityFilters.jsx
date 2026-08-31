import React from 'react';
import { Sparkles, TrendingUp, Users, Clock, Filter } from 'lucide-react';
import { COMMUNITY_CATEGORIES } from '../../data/communityData';

export const CommunityFilters = ({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  activeTab,
  onTabChange,
  myCommunitiesCount = 0
}) => {
  const sortOptions = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'popular', label: 'Most Popular', icon: Users },
    { id: 'new', label: 'Newest', icon: Clock },
  ];

  return (
    <div className="space-y-3.5">
      {/* Top Bar: Tabs (Discover vs My Communities) and Sort Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-borderTheme/70">
        {/* Main Tab Navigation */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface border border-borderTheme/80 self-start">
          <button
            onClick={() => onTabChange('discover')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${
              activeTab === 'discover'
                ? 'bg-card text-primary shadow-xs border border-borderTheme'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Discover Communities
          </button>
          <button
            onClick={() => onTabChange('my-communities')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'my-communities'
                ? 'bg-card text-primary shadow-xs border border-borderTheme'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <span>My Communities</span>
            {myCommunitiesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[10px]">
                {myCommunitiesCount}
              </span>
            )}
          </button>
        </div>

        {/* Sort Selector */}
        {activeTab === 'discover' && (
          <div className="flex items-center gap-1.5 text-xs font-heading">
            <span className="text-textSecondary text-[11px] font-semibold hidden sm:inline">Sort:</span>
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-surface border border-borderTheme">
              {sortOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = sortBy === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onSortChange(opt.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-card text-primary shadow-xs font-bold'
                        : 'text-textSecondary hover:text-textPrimary'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Category Pills (Visible in Discover Mode) */}
      {activeTab === 'discover' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin no-scrollbar">
          <span className="text-textSecondary text-xs font-heading font-bold flex items-center gap-1 shrink-0 mr-1 pl-0.5">
            <Filter className="w-3 h-3 text-secondary" />
            Category:
          </span>
          {COMMUNITY_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-heading font-bold whitespace-nowrap transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-card text-textSecondary border-borderTheme hover:border-primary/50 hover:text-textPrimary hover:bg-surface'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommunityFilters;

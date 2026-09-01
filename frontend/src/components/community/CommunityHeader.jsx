import React from 'react';
import { Search, Plus, Sparkles, Users, MessageSquare, X } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

export const CommunityHeader = ({
  searchQuery,
  onSearchChange,
  onCreateClick,
  totalCommunities = 10,
  totalMembers = '18.5k'
}) => {
  return (
    <Card className="relative overflow-hidden bg-cardAccent border-[1.5px] border-borderTheme p-5 sm:p-7 shadow-medium">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        {/* Left: Titles & Taglines */}
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-borderTheme text-xs font-heading font-bold text-textPrimary shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span>Developer & Algorithm Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-textPrimary tracking-tight">
            AlgoVerse Community 👥
          </h1>

          <p className="text-textSecondary text-sm sm:text-base font-body leading-relaxed">
            Learn together. Build together. Solve together. Join algorithm guilds, connect with mentors, and collaborate on daily problem solving.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-heading font-semibold text-textSecondary">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/60 border border-borderTheme/70">
              <Users className="w-3.5 h-3.5 text-secondary" />
              <span>{totalMembers} {totalMembers === 1 ? 'Member' : 'Members'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/60 border border-borderTheme/70">
              <MessageSquare className="w-3.5 h-3.5 text-success" />
              <span>{totalCommunities} {totalCommunities === 1 ? 'Community' : 'Communities'}</span>
            </div>
          </div>
        </div>

        {/* Right: Search & Create Community Action */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          {/* Search Bar */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search communities, topics..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-card border-[1.5px] border-borderTheme rounded-input text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs transition-all font-body"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-textSecondary hover:text-textPrimary hover:bg-surface transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Create Community CTA */}
          <Button
            variant="primary"
            size="md"
            onClick={onCreateClick}
            className="whitespace-nowrap shadow-soft flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Community</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CommunityHeader;

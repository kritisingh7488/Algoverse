import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Sparkles, 
  Search, 
  Plus, 
  Flame, 
  BookOpen, 
  ShieldCheck, 
  HelpCircle,
  FolderSearch,
  RotateCcw,
  X,
  LogIn
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import useAuthStore from '../store/authStore';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

import CommunityHeader from '../components/community/CommunityHeader';
import GlobalChatCard from '../components/community/GlobalChatCard';
import CommunityFilters from '../components/community/CommunityFilters';
import CommunityCard from '../components/community/CommunityCard';
import TrendingCommunities from '../components/community/TrendingCommunities';
import MyCommunities from '../components/community/MyCommunities';
import CreateCommunityModal from '../components/community/CreateCommunityModal';

import { 
  getAllCommunities, 
  getJoinedCommunityIds, 
  toggleJoinCommunity 
} from '../data/communityData';

const Community = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [communities, setCommunities] = useState([]);
  const [joinedIds, setJoinedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('trending');
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' | 'my-communities'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data from local state / seed
  useEffect(() => {
    const loaded = getAllCommunities();
    const joined = getJoinedCommunityIds();
    setCommunities(loaded);
    setJoinedIds(joined);
    setIsLoading(false);
  }, []);

  // Guarded Create Click
  const handleCreateClick = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsCreateModalOpen(true);
  };

  // Handle Join Toggle
  const handleToggleJoin = (communityId) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    const updated = toggleJoinCommunity(communityId);
    setJoinedIds(updated);

    // Increment/Decrement member count in local state
    setCommunities(prev => prev.map(c => {
      if (c.id === communityId) {
        const wasJoined = joinedIds.includes(communityId);
        return {
          ...c,
          membersCount: wasJoined ? Math.max(1, c.membersCount - 1) : c.membersCount + 1
        };
      }
      return c;
    }));
  };

  // Handle newly created community
  const handleCommunityCreated = (newCommunity) => {
    setCommunities(prev => [newCommunity, ...prev]);
    setJoinedIds(prev => [...prev, newCommunity.id]);
    setSelectedCategory('All');
    setSearchQuery('');
    setActiveTab('my-communities');
  };

  // Filtered & Sorted Discover List
  const filteredCommunities = useMemo(() => {
    return communities.filter(comm => {
      // Category filter
      if (selectedCategory !== 'All' && comm.category !== selectedCategory) {
        return false;
      }
      // Search query filter (name, description, tags, category)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = comm.name.toLowerCase().includes(q);
        const matchDesc = comm.description.toLowerCase().includes(q);
        const matchCat = comm.category.toLowerCase().includes(q);
        const matchTags = comm.tags && comm.tags.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchCat && !matchTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'trending') {
        return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0) || (b.membersCount - a.membersCount);
      }
      if (sortBy === 'popular') {
        return (b.membersCount || 0) - (a.membersCount || 0);
      }
      if (sortBy === 'new') {
        return (b.createdDate === 'Just now' ? 1 : 0) - (a.createdDate === 'Just now' ? 1 : 0);
      }
      return 0;
    });
  }, [communities, selectedCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('trending');
  };

  return (
    <AppLayout>
      <div className="space-y-5 py-2">
        {/* 1. Community Top Banner & Search */}
        <CommunityHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateClick={handleCreateClick}
          totalCommunities={communities.length}
          totalMembers="18.5k"
        />

        {/* Main Grid: Left Discovery/MyCommunities Column + Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          
          {/* Main 2-Column Content Area */}
          <div className="lg:col-span-2 space-y-5 min-w-0">
            
            {/* Global Chat Featured Preview */}
            <GlobalChatCard onEnterChat={() => navigate('/community/chat')} />

            {/* Filter & Tab Switcher Toolbar */}
            <CommunityFilters
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              myCommunitiesCount={joinedIds.length}
            />

            {/* Content Switcher */}
            {activeTab === 'discover' ? (
              <div className="space-y-4">
                {/* Search result status when searching */}
                {searchQuery && (
                  <div className="flex items-center justify-between px-1 text-xs font-body text-textSecondary">
                    <span>
                      Found <strong className="text-textPrimary">{filteredCommunities.length}</strong> {filteredCommunities.length === 1 ? 'community' : 'communities'} for "{searchQuery}"
                    </span>
                    <button
                      onClick={handleResetFilters}
                      className="text-primary hover:underline font-heading font-bold text-xs flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset filters
                    </button>
                  </div>
                )}

                {/* Loading Skeleton */}
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} className="h-48 rounded-2xl bg-surface/50 border border-borderTheme animate-pulse" />
                    ))}
                  </div>
                ) : filteredCommunities.length > 0 ? (
                  /* Community Cards Grid */
                  <motion.div 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <AnimatePresence>
                      {filteredCommunities.map((comm) => (
                        <motion.div
                          key={comm.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <CommunityCard
                            community={comm}
                            isJoined={joinedIds.includes(comm.id)}
                            onToggleJoin={handleToggleJoin}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  /* Empty State when 0 search results */
                  <Card className="text-center py-12 px-6 bg-card border-[1.5px] border-borderTheme shadow-soft space-y-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-surface border border-borderTheme flex items-center justify-center text-textSecondary mx-auto text-xl shadow-xs">
                      🔍
                    </div>
                    <div className="space-y-1 max-w-sm mx-auto">
                      <h3 className="text-base font-heading font-bold text-textPrimary">
                        No communities found
                      </h3>
                      <p className="text-xs text-textSecondary font-body">
                        We couldn't find any communities matching "{searchQuery}". Try a different keyword or category.
                      </p>
                    </div>
                    <div className="pt-1 flex justify-center">
                      <Button variant="outline" size="sm" onClick={handleResetFilters}>
                        Clear All Filters
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            ) : (
              /* My Communities Tab */
              <MyCommunities
                communities={communities}
                joinedIds={joinedIds}
                onToggleJoin={handleToggleJoin}
                onExploreClick={() => setActiveTab('discover')}
                onCreateClick={() => setIsCreateModalOpen(true)}
                isAuthenticated={isAuthenticated}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">
            {/* Trending Communities Widget */}
            <TrendingCommunities
              communities={communities}
              joinedIds={joinedIds}
              onToggleJoin={handleToggleJoin}
            />

            {/* Community Code of Conduct Card */}
            <Card className="bg-card border-[1.5px] border-borderTheme p-4 sm:p-5 shadow-soft space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-borderTheme">
                <div className="p-1 rounded-lg bg-primary/15 text-primary">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-heading font-bold text-textPrimary">
                  Community Guidelines
                </h3>
              </div>
              <ul className="space-y-2 text-xs font-body text-textSecondary">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold text-sm leading-none">•</span>
                  <span><strong>Be respectful & kind</strong>: Everyone learns at their own pace.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold text-sm leading-none">•</span>
                  <span><strong>Format code snippets</strong>: Use indentation and syntax formatting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold text-sm leading-none">•</span>
                  <span><strong>Share approaches</strong>: Explain intuition, not just raw answers.</span>
                </li>
              </ul>
            </Card>

            {/* Daily Algorithm Study Buddy Card */}
            <Card className="bg-cardAccent/50 border border-borderTheme p-4 shadow-soft space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🐱</span>
                <div>
                  <h4 className="text-xs font-heading font-bold text-textPrimary">
                    Study Streak Companion
                  </h4>
                  <p className="text-[11px] text-textSecondary">Solve algorithms with peers</p>
                </div>
              </div>
              <p className="text-xs text-textSecondary font-body leading-relaxed">
                Joining a community increases daily practice consistency by <strong>3.4x</strong>!
              </p>
            </Card>
          </div>

        </div>

        {/* Create Community Modal */}
        <CreateCommunityModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCommunityCreated={handleCommunityCreated}
        />

        {/* Unauthenticated Login Prompt Modal */}
        <AnimatePresence>
          {isAuthModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAuthModalOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                className="relative w-full max-w-md bg-card rounded-dialog border-[1.5px] border-borderTheme p-6 shadow-large z-10 text-center space-y-4 font-body"
              >
                <button
                  onClick={() => setIsAuthModalOpen(false)}
                  className="absolute right-4 top-4 p-1.5 rounded-lg text-textSecondary hover:text-textPrimary hover:bg-surface transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary text-xl mx-auto shadow-xs">
                  👋
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-heading font-bold text-textPrimary">
                    Join the AlgoVerse Community
                  </h3>
                  <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
                    Create an account or log in to join study guilds, track your daily problem streak, and create your own communities.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" size="md" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" className="flex-1">
                    <Button variant="primary" size="md" className="w-full">
                      Sign Up Free
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default Community;

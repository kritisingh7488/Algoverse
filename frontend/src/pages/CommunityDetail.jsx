import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Globe, 
  Lock, 
  Check, 
  Plus, 
  ArrowLeft, 
  ShieldCheck, 
  Share2, 
  MessageSquare, 
  BookOpen, 
  Sparkles, 
  Calendar,
  AlertCircle,
  HelpCircle,
  Hash
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

import { 
  getAllCommunities, 
  getJoinedCommunityIds, 
  toggleJoinCommunity 
} from '../data/communityData';

export const CommunityDetail = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();

  const [community, setCommunity] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState('about'); // 'about' | 'discussions' | 'chat' | 'members'
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const all = getAllCommunities();
    const found = all.find(c => c.id === communityId || c.slug === communityId);
    setCommunity(found || null);

    const joined = getJoinedCommunityIds();
    if (found) {
      setIsJoined(joined.includes(found.id));
    }
  }, [communityId]);

  const handleToggleJoin = () => {
    if (!community) return;
    const updated = toggleJoinCommunity(community.id);
    const nowJoined = updated.includes(community.id);
    setIsJoined(nowJoined);

    setCommunity(prev => ({
      ...prev,
      membersCount: nowJoined ? prev.membersCount + 1 : Math.max(1, prev.membersCount - 1)
    }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!community) {
    return (
      <AppLayout>
        <div className="py-12 max-w-lg mx-auto text-center space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-danger/15 border border-danger/25 flex items-center justify-center text-danger mx-auto text-2xl shadow-xs">
            ⚠️
          </div>
          <h2 className="text-xl font-heading font-bold text-textPrimary">
            Community Not Found
          </h2>
          <p className="text-xs sm:text-sm text-textSecondary font-body leading-relaxed">
            The community you are looking for does not exist or has been relocated.
          </p>
          <Link to="/community">
            <Button variant="primary" size="md" className="gap-1.5 mt-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Communities</span>
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-5 py-2 max-w-5xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-heading font-semibold text-textSecondary">
          <Link to="/community" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Community Hub</span>
          </Link>
          <span>/</span>
          <span className="text-textPrimary truncate">{community.name}</span>
        </div>

        {/* Community Banner Header Card */}
        <Card className="relative overflow-hidden bg-card border-[1.5px] border-borderTheme p-5 sm:p-7 shadow-medium">
          {/* Top Decorative Gradient */}
          <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-r ${community.gradient || 'from-primary/20 to-secondary/20'} border-b border-borderTheme/50`} />

          <div className="relative pt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            {/* Left: Icon, Name, Category, Badges */}
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-3xl bg-card border-2 border-borderTheme flex items-center justify-center text-4xl shadow-medium shrink-0">
                {community.icon || '💬'}
              </div>

              <div className="space-y-1 pb-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-heading font-bold text-textPrimary">
                    {community.name}
                  </h1>
                  {community.isVerified && (
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" title="Verified Community" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-textSecondary font-body">
                  <Badge variant="primary" size="sm">
                    {community.category}
                  </Badge>
                  <span className="flex items-center gap-1 text-[11px]">
                    {community.isPrivate ? (
                      <>
                        <Lock className="w-3 h-3 text-warning" />
                        <span>Private Guild</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-3 h-3 text-success" />
                        <span>Public Community</span>
                      </>
                    )}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-secondary" />
                    <span>{(community.membersCount || 0).toLocaleString()} Members</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions (Join & Share) */}
            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              <Button
                variant="outline"
                size="md"
                onClick={handleShare}
                className="gap-1.5"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </Button>

              <Button
                variant={isJoined ? 'outline' : 'primary'}
                size="md"
                onClick={handleToggleJoin}
                className="gap-1.5 shadow-soft min-w-[110px]"
              >
                {isJoined ? (
                  <>
                    <Check className="w-4 h-4 text-success" />
                    <span>Joined</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Join Guild</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="pt-5 mt-5 border-t border-borderTheme/70">
            <p className="text-xs sm:text-sm text-textSecondary font-body leading-relaxed max-w-3xl">
              {community.description}
            </p>
          </div>
        </Card>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface border border-borderTheme/80 self-start overflow-x-auto">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'bg-card text-primary shadow-xs border border-borderTheme'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Overview & Rules</span>
          </button>
          <button
            onClick={() => setActiveTab('discussions')}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'discussions'
                ? 'bg-card text-primary shadow-xs border border-borderTheme'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Discussions</span>
            <span className="px-1.5 py-0.2 rounded-full bg-primary/15 text-primary text-[9px]">Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-card text-primary shadow-xs border border-borderTheme'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Chat</span>
            <span className="px-1.5 py-0.2 rounded-full bg-secondary/15 text-secondary text-[9px]">Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'members'
                ? 'bg-card text-primary shadow-xs border border-borderTheme'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Members ({(community.membersPreview || []).length})</span>
          </button>
        </div>

        {/* Tab 1: About & Rules */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Left 2 Cols: About & Rules */}
            <div className="md:col-span-2 space-y-5">
              <Card className="bg-card border-[1.5px] border-borderTheme p-5 shadow-soft space-y-3">
                <h3 className="text-sm font-heading font-bold text-textPrimary">
                  About This Community
                </h3>
                <p className="text-xs sm:text-sm text-textSecondary font-body leading-relaxed">
                  {community.about || community.description}
                </p>
                {community.tags && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {community.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-surface text-xs font-heading font-semibold text-textSecondary border border-borderTheme"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Card>

              {/* Rules Card */}
              <Card className="bg-card border-[1.5px] border-borderTheme p-5 shadow-soft space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-borderTheme">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-heading font-bold text-textPrimary">
                    Community Rules & Guidelines
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {(community.rules || [
                    'Be respectful and constructive with feedback.',
                    'Keep algorithm discussions friendly for all skill levels.'
                  ]).map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs font-body text-textSecondary">
                      <span className="w-5 h-5 rounded-full bg-primary/15 text-primary font-heading font-bold flex items-center justify-center text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{rule}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right 1 Col: Quick Info */}
            <div className="space-y-4">
              <Card className="bg-card border-[1.5px] border-borderTheme p-5 shadow-soft space-y-3">
                <h4 className="text-xs font-heading font-bold text-textPrimary">
                  Guild Details
                </h4>
                <div className="space-y-2 text-xs font-body text-textSecondary">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-secondary" />
                      <span>Created</span>
                    </span>
                    <strong className="text-textPrimary">{community.createdDate || 'January 2025'}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-primary" />
                      <span>Category</span>
                    </span>
                    <strong className="text-textPrimary">{community.category}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-success" />
                      <span>Total Members</span>
                    </span>
                    <strong className="text-textPrimary">{(community.membersCount || 0).toLocaleString()}</strong>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Discussions Placeholder */}
        {activeTab === 'discussions' && (
          <Card className="text-center py-14 px-6 bg-card border-[1.5px] border-borderTheme shadow-soft space-y-4">
            <div className="w-14 h-14 rounded-3xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary mx-auto text-2xl shadow-xs">
              💬
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-heading font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Feature Roadmap</span>
              </div>
              <h3 className="text-lg font-heading font-bold text-textPrimary">
                Community Discussions — Coming Next
              </h3>
              <p className="text-xs sm:text-sm text-textSecondary font-body leading-relaxed">
                Post questions, share algorithm solution breakdowns, code reviews, and upvote the most insightful community answers.
              </p>
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={() => setActiveTab('about')}>
                Return to Overview
              </Button>
            </div>
          </Card>
        )}

        {/* Tab 3: Live Chat Placeholder */}
        {activeTab === 'chat' && (
          <Card className="text-center py-14 px-6 bg-card border-[1.5px] border-borderTheme shadow-soft space-y-4">
            <div className="w-14 h-14 rounded-3xl bg-secondary/15 border border-secondary/25 flex items-center justify-center text-secondary mx-auto text-2xl shadow-xs">
              ⚡
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-heading font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Feature Roadmap</span>
              </div>
              <h3 className="text-lg font-heading font-bold text-textPrimary">
                Community Chat — Coming Next
              </h3>
              <p className="text-xs sm:text-sm text-textSecondary font-body leading-relaxed">
                Real-time room channels for <strong>{community.name}</strong> with code syntax highlighting and peer debugging.
              </p>
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={() => setActiveTab('about')}>
                Return to Overview
              </Button>
            </div>
          </Card>
        )}

        {/* Tab 4: Members Preview */}
        {activeTab === 'members' && (
          <Card className="bg-card border-[1.5px] border-borderTheme p-5 shadow-soft space-y-4">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-borderTheme">
              <h3 className="text-sm font-heading font-bold text-textPrimary">
                Guild Leaders & Members
              </h3>
              <span className="text-xs text-textSecondary font-body">
                {(community.membersPreview || []).length} Shown
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(community.membersPreview || []).map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-surface/60 hover:bg-surface border border-borderTheme/70 transition-colors flex items-center gap-3"
                >
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-9 h-9 rounded-full object-cover border border-borderTheme shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-heading font-bold text-textPrimary truncate">
                      {m.name}
                    </h4>
                    <p className="text-[11px] text-textSecondary font-body truncate">
                      {m.role}
                    </p>
                  </div>
                  <Badge variant="primary" size="sm" className="shrink-0 text-[10px]">
                    {m.xp} XP
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

      </div>
    </AppLayout>
  );
};

export default CommunityDetail;

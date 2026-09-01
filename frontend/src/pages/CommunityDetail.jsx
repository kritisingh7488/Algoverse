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
  Hash,
  Search,
  SlidersHorizontal,
  Loader2,
  Edit3,
  UserCheck,
  UserPlus,
  Clock,
  X,
  Send
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

import useAuthStore from '../store/authStore';
import communityService from '../api/communityService';
import PostCard from '../components/community/PostCard';
import CreatePostModal from '../components/community/CreatePostModal';
import CommunityChatRoom from '../components/community/CommunityChatRoom';
import { POST_TYPES } from '../components/community/PostTypeBadge';

export const CommunityDetail = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [community, setCommunity] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [copied, setCopied] = useState(false);

  // Join Requests & Invitations State
  const [joinRequestStatus, setJoinRequestStatus] = useState('none');
  const [isRequesting, setIsRequesting] = useState(false);
  const [joinRequests, setJoinRequests] = useState([]);
  const [joinRequestsLoading, setJoinRequestsLoading] = useState(false);
  const [inviteUsername, setInviteUsername] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteNotice, setInviteNotice] = useState({ type: '', text: '' });

  // Post feed state
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postTypeFilter, setPostTypeFilter] = useState('All');
  const [postSearch, setPostSearch] = useState('');
  const [postSort, setPostSort] = useState('newest');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const myUserId = user?._id ? user._id.toString() : (user?.id ? user.id.toString() : null);
  const creatorId = community?.creator?._id ? community.creator._id.toString() : (community?.creator ? community.creator.toString() : null);
  const isCreator = !!(myUserId && creatorId && myUserId === creatorId);
  const isAdmin = user?.role === 'admin';
  const canManageCommunity = isCreator || isAdmin;

  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      setIsLoading(true);
      setErrorStatus(null);
      try {
        const res = await communityService.getCommunityByIdOrSlug(communityId);
        if (!isMounted) return;

        if (res.success && res.data) {
          setCommunity(res.data);
          setIsJoined(!!res.data.isJoined);
        } else {
          setErrorStatus(res.status || 404);
        }
      } catch (err) {
        if (isMounted) setErrorStatus(err.response?.status || 404);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDetail();
    return () => { isMounted = false; };
  }, [communityId, isAuthenticated]);

  // Check user's join request status if not a member or 403
  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;
    const checkReqStatus = async () => {
      try {
        const res = await communityService.getMyRequestStatus(communityId);
        if (isMounted && res.success) {
          setJoinRequestStatus(res.status || 'none');
        }
      } catch (err) {
        // ignore
      }
    };
    checkReqStatus();
    return () => { isMounted = false; };
  }, [communityId, isAuthenticated]);

  // Fetch pending join requests if creator/admin
  useEffect(() => {
    if (!canManageCommunity || !community || activeTab !== 'requests') return;

    let isMounted = true;
    const fetchRequests = async () => {
      setJoinRequestsLoading(true);
      try {
        const commTarget = community.slug || community._id || community.id;
        const res = await communityService.getJoinRequests(commTarget);
        if (isMounted && res.success && Array.isArray(res.data)) {
          setJoinRequests(res.data);
        }
      } catch (err) {
        console.error('Error fetching join requests:', err);
      } finally {
        if (isMounted) setJoinRequestsLoading(false);
      }
    };

    fetchRequests();
    return () => { isMounted = false; };
  }, [activeTab, canManageCommunity, community]);

  // Fetch discussions when switching to discussions tab or changing filters
  useEffect(() => {
    if (activeTab !== 'discussions' || !community) return;

    let isMounted = true;
    const fetchCommunityPosts = async () => {
      setPostsLoading(true);
      try {
        const commIdentifier = community.slug || community.id || community._id;
        const res = await communityService.getPosts({
          communityId: commIdentifier,
          postType: postTypeFilter,
          search: postSearch,
          sort: postSort
        });

        if (isMounted && res.success && Array.isArray(res.data)) {
          setPosts(res.data);
        }
      } catch (err) {
        console.error('Error fetching discussions:', err);
      } finally {
        if (isMounted) setPostsLoading(false);
      }
    };

    fetchCommunityPosts();
    return () => { isMounted = false; };
  }, [activeTab, community, postTypeFilter, postSearch, postSort]);

  const handleToggleJoin = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!community) return;

    const commIdentifier = community.id || community._id || community.slug;

    // If private community and not joined, request to join
    if (community.isPrivate && !isJoined) {
      await handleRequestToJoin();
      return;
    }

    const nowJoined = !isJoined;
    setIsJoined(nowJoined);

    setCommunity(prev => ({
      ...prev,
      membersCount: nowJoined ? (prev.membersCount || 1) + 1 : Math.max(1, (prev.membersCount || 2) - 1)
    }));

    try {
      if (nowJoined) {
        await communityService.joinCommunity(commIdentifier);
      } else {
        await communityService.leaveCommunity(commIdentifier);
      }
    } catch (err) {
      console.error('Error toggling community join:', err);
    }
  };

  const handleRequestToJoin = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsRequesting(true);
    try {
      const res = await communityService.sendJoinRequest(communityId);
      if (res.success) {
        setJoinRequestStatus('pending');
      }
    } catch (err) {
      console.error('Error requesting to join:', err);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleCancelRequest = async () => {
    setIsRequesting(true);
    try {
      const res = await communityService.cancelJoinRequest(communityId);
      if (res.success) {
        setJoinRequestStatus('none');
      }
    } catch (err) {
      console.error('Error cancelling join request:', err);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    const commTarget = community?.slug || community?._id || community?.id;
    try {
      const res = await communityService.approveJoinRequest(commTarget, requestId);
      if (res.success) {
        setJoinRequests(prev => prev.filter(r => r._id !== requestId));
        if (res.data?.membersCount) {
          setCommunity(prev => ({ ...prev, membersCount: res.data.membersCount }));
        }
      }
    } catch (err) {
      console.error('Error approving request:', err);
    }
  };

  const handleRejectRequest = async (requestId) => {
    const commTarget = community?.slug || community?._id || community?.id;
    try {
      const res = await communityService.rejectJoinRequest(commTarget, requestId);
      if (res.success) {
        setJoinRequests(prev => prev.filter(r => r._id !== requestId));
      }
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteUsername.trim()) return;
    setIsInviting(true);
    setInviteNotice({ type: '', text: '' });
    try {
      const commTarget = community?.slug || community?._id || community?.id;
      const res = await communityService.sendInvitation(commTarget, {
        username: inviteUsername.trim(),
        message: inviteMessage.trim()
      });
      if (res.success) {
        setInviteNotice({ type: 'success', text: `Invitation sent to ${inviteUsername}!` });
        setInviteUsername('');
        setInviteMessage('');
      } else {
        setInviteNotice({ type: 'error', text: res.message || 'Failed to send invitation' });
      }
    } catch (err) {
      setInviteNotice({ type: 'error', text: err.message || 'Failed to send invitation' });
    } finally {
      setIsInviting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setActiveTab('discussions');
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-textSecondary font-body">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs sm:text-sm font-heading font-semibold">Loading guild details...</p>
        </div>
      </AppLayout>
    );
  }

  if (errorStatus === 403) {
    return (
      <AppLayout>
        <div className="py-16 max-w-lg mx-auto text-center space-y-4 font-body">
          <div className="w-14 h-14 rounded-3xl bg-warning/15 border border-warning/25 flex items-center justify-center text-warning mx-auto text-2xl shadow-xs">
            🔒
          </div>
          <h2 className="text-xl font-heading font-bold text-textPrimary">
            Private Community
          </h2>
          <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
            This study group is private. You must be an approved member to view details and discussions.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2.5 pt-2">
            {joinRequestStatus === 'pending' ? (
              <Button
                variant="outline"
                size="md"
                onClick={handleCancelRequest}
                disabled={isRequesting}
                className="gap-1.5 border-warning/40 text-warning hover:bg-danger/10 hover:text-danger hover:border-danger/30"
              >
                <Clock className="w-4 h-4 text-warning" />
                <span>Request Pending (Cancel)</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleRequestToJoin}
                disabled={isRequesting}
                className="gap-1.5 bg-warning text-black hover:bg-warning/90 shadow-soft"
              >
                <Lock className="w-4 h-4" />
                <span>Request to Join</span>
              </Button>
            )}
            <Link to="/community">
              <Button variant="outline" size="md" className="gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Communities</span>
              </Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!community) {
    return (
      <AppLayout>
        <div className="py-12 max-w-lg mx-auto text-center space-y-4 font-body">
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
      <div className="space-y-6 max-w-6xl mx-auto font-body pb-12">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/community"
            className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-textSecondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Communities</span>
          </Link>
        </div>

        {/* Community Hero Card */}
        <Card className="bg-card border-[1.5px] border-borderTheme p-6 sm:p-8 shadow-soft relative overflow-hidden">
          <div
            className={`absolute top-0 right-0 w-72 h-72 rounded-full bg-gradient-to-br ${community.gradient} blur-3xl opacity-20 pointer-events-none -mr-20 -mt-20`}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-xs border border-borderTheme shrink-0 bg-surface"
                style={{ backgroundColor: `${community.accentColor}15` }}
              >
                {community.icon || '⚡'}
              </div>
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-heading font-bold text-textPrimary leading-tight">
                    {community.name}
                  </h1>
                  {community.isVerified && (
                    <span className="flex items-center gap-0.5 text-[10px] font-heading font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                  {community.isPrivate ? (
                    <span className="flex items-center gap-0.5 text-[10px] font-heading font-semibold px-2 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/25">
                      <Lock className="w-3 h-3" />
                      <span>Private</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-[10px] font-heading font-semibold px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/25">
                      <Globe className="w-3 h-3" />
                      <span>Public</span>
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-textSecondary font-body max-w-2xl leading-relaxed">
                  {community.description}
                </p>
                <div className="flex items-center gap-4 text-xs font-heading font-semibold text-textSecondary pt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span>{(community.membersCount || 0).toLocaleString()} Members</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-secondary" />
                    <span>{community.category}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    <span>Est. {community.createdDate || '2025'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </Button>
              <Button
                variant={isJoined ? 'outline' : 'primary'}
                size="sm"
                onClick={handleToggleJoin}
                className="gap-1.5"
              >
                {isJoined ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-success" />
                    <span>Joined Guild</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Join Community</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-borderTheme w-full sm:w-fit overflow-x-auto">
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
            {posts.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-primary/15 text-primary text-[10px]">
                {posts.length}
              </span>
            )}
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
            <span>Members ({(community.members || []).length})</span>
          </button>

          {canManageCommunity && (
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-lg text-xs font-heading font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'requests'
                  ? 'bg-card text-primary shadow-xs border border-borderTheme'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-warning" />
              <span>Requests & Invites</span>
              {joinRequests.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-warning/20 text-warning text-[10px] font-bold">
                  {joinRequests.length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Tab 1: About & Rules */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                    'Keep algorithm discussions friendly for all skill levels.',
                    'Cite time and space complexity when presenting solutions.'
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

              {/* Discussion Shortcut Card */}
              <Card className="bg-primary/5 border-[1.5px] border-primary/20 p-5 shadow-soft space-y-2 text-center">
                <h4 className="text-xs font-heading font-bold text-textPrimary">Have an Algorithm Question?</h4>
                <p className="text-[11px] text-textSecondary">
                  Start a discussion, share a solution breakdown, or ask for peer review.
                </p>
                <Button
                  size="xs"
                  variant="primary"
                  className="w-full gap-1.5 mt-1"
                  onClick={() => {
                    setActiveTab('discussions');
                    setIsCreatePostOpen(true);
                  }}
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Start Discussion</span>
                </Button>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Live Community Discussions Feed (PHASE 3) */}
        {activeTab === 'discussions' && (
          <div className="space-y-5">
            {/* Discussions Controls Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border border-borderTheme">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
                <input
                  type="text"
                  value={postSearch}
                  onChange={(e) => setPostSearch(e.target.value)}
                  placeholder="Search discussions, tags, or topics..."
                  className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-surface border border-borderTheme focus:border-primary focus:outline-hidden text-xs text-textPrimary placeholder:text-textSecondary/60"
                />
              </div>

              {/* Sort Dropdown & Create Post CTA */}
              <div className="flex items-center gap-2">
                <select
                  value={postSort}
                  onChange={(e) => setPostSort(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-borderTheme text-xs font-heading font-semibold text-textSecondary focus:border-primary focus:outline-hidden"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="most_commented">Most Discussed</option>
                </select>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIsCreatePostOpen(true)}
                  className="gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Post</span>
                </Button>
              </div>
            </div>

            {/* Post Type Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setPostTypeFilter('All')}
                className={`px-3 py-1 rounded-full text-xs font-heading font-semibold transition-all shrink-0 border ${
                  postTypeFilter === 'All'
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-surface text-textSecondary hover:text-textPrimary border-borderTheme'
                }`}
              >
                All Posts
              </button>
              {POST_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setPostTypeFilter(t.id)}
                  className={`px-3 py-1 rounded-full text-xs font-heading font-semibold transition-all shrink-0 border ${
                    postTypeFilter === t.id
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-surface text-textSecondary hover:text-textPrimary border-borderTheme'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Discussions List */}
            {postsLoading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-2 text-textSecondary">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xs font-heading">Loading discussions...</span>
              </div>
            ) : posts.length === 0 ? (
              <Card className="text-center py-14 px-6 bg-card border-[1.5px] border-borderTheme shadow-soft space-y-4">
                <div className="w-14 h-14 rounded-3xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary mx-auto text-2xl shadow-xs">
                  💬
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-base font-heading font-bold text-textPrimary">
                    No discussions found
                  </h3>
                  <p className="text-xs text-textSecondary font-body leading-relaxed">
                    {postSearch || postTypeFilter !== 'All'
                      ? 'No posts match your current search and type filters. Try adjusting your query.'
                      : `Be the first to share an algorithm insight or question in ${community.name}!`}
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsCreatePostOpen(true)}
                    className="gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create First Post</span>
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-3.5">
                {posts.map((post) => (
                  <PostCard
                    key={post._id || post.id}
                    post={post}
                    communityId={community.slug || community.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Real Community Live Chat Room */}
        {activeTab === 'chat' && (
          <CommunityChatRoom
            community={community}
            isJoined={isJoined}
            onJoinClick={handleToggleJoin}
          />
        )}

        {/* Tab 4: Real Members List from MongoDB */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-heading font-bold text-textPrimary">
                Community Roster ({community.membersCount || (community.members?.length || 0)} members)
              </h3>
            </div>

            {(!community.members || community.members.length === 0) ? (
              <Card className="text-center py-12 px-6 bg-card border-[1.5px] border-borderTheme text-textSecondary space-y-2">
                <Users className="w-10 h-10 mx-auto text-textSecondary/50" />
                <p className="text-sm font-heading font-semibold text-textPrimary">
                  No other members yet
                </p>
                <p className="text-xs">
                  Join this community to become an active contributor!
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Community Creator */}
                {community.creator && (
                  <Card
                    key={community.creator._id || 'creator'}
                    className="p-4 bg-card border-[1.5px] border-primary/30 hover:border-primary transition-all shadow-soft flex items-center gap-3.5"
                  >
                    {community.creator.avatar ? (
                      <img
                        src={community.creator.avatar}
                        alt={community.creator.fullName || community.creator.username}
                        className="w-10 h-10 rounded-full object-cover border border-primary/40 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/30">
                        {community.creator.fullName?.[0]?.toUpperCase() || community.creator.username?.[0]?.toUpperCase() || 'C'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-heading font-bold text-textPrimary truncate">
                          {community.creator.fullName || community.creator.username}
                        </h4>
                        <span className="px-1.5 py-0.2 rounded bg-primary/15 text-primary text-[9px] font-bold">
                          Founder
                        </span>
                      </div>
                      <p className="text-[11px] text-textSecondary truncate">@{community.creator.username}</p>
                      <span className="text-[10px] text-primary font-heading font-semibold">
                        {community.creator.xp || 0} XP
                      </span>
                    </div>
                  </Card>
                )}

                {/* Other Members */}
                {community.members
                  .filter(m => !community.creator || (m._id !== community.creator._id && m._id !== community.creator))
                  .map((m) => (
                    <Card
                      key={m._id || m.id || Math.random()}
                      className="p-4 bg-card border-[1.5px] border-borderTheme hover:border-primary/40 transition-all shadow-soft flex items-center gap-3.5"
                    >
                      {m.avatar ? (
                        <img
                          src={m.avatar}
                          alt={m.fullName || m.username || 'Member'}
                          className="w-10 h-10 rounded-full object-cover border border-borderTheme shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-surface text-textPrimary flex items-center justify-center font-bold text-sm shrink-0 border border-borderTheme">
                          {m.fullName?.[0]?.toUpperCase() || m.username?.[0]?.toUpperCase() || <Users className="w-4 h-4" />}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-heading font-bold text-textPrimary truncate">
                          {m.fullName || m.username || 'Learner'}
                        </h4>
                        <p className="text-[11px] text-textSecondary truncate">{m.role || 'Member'}</p>
                        <span className="text-[10px] text-primary font-heading font-semibold">
                          {m.xp || 0} XP
                        </span>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Requests & Invites (Creator/Admin only) */}
        {activeTab === 'requests' && canManageCommunity && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Pending Join Requests */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-heading font-bold text-textPrimary flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-warning" />
                    <span>Pending Join Requests ({joinRequests.length})</span>
                  </h3>
                </div>

                {joinRequestsLoading ? (
                  <div className="py-12 text-center text-textSecondary font-body">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                    <p className="text-xs mt-2">Loading join requests...</p>
                  </div>
                ) : joinRequests.length === 0 ? (
                  <Card className="text-center py-10 px-6 bg-card border-[1.5px] border-borderTheme text-textSecondary space-y-2">
                    <Check className="w-8 h-8 mx-auto text-success/60" />
                    <p className="text-sm font-heading font-semibold text-textPrimary">
                      All caught up!
                    </p>
                    <p className="text-xs">
                      No pending membership requests for this community.
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {joinRequests.map((req) => (
                      <Card
                        key={req._id}
                        className="p-4 bg-card border-[1.5px] border-borderTheme hover:border-primary/40 transition-all shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          {req.user?.avatar ? (
                            <img
                              src={req.user.avatar}
                              alt={req.user.fullName || req.user.username}
                              className="w-10 h-10 rounded-full object-cover border border-borderTheme shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-surface text-textPrimary flex items-center justify-center font-bold text-sm shrink-0 border border-borderTheme">
                              {req.user?.fullName?.[0]?.toUpperCase() || req.user?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-heading font-bold text-textPrimary truncate">
                                {req.user?.fullName || req.user?.username}
                              </h4>
                              <span className="text-[10px] text-primary font-heading font-semibold">
                                {req.user?.xp || 0} XP
                              </span>
                            </div>
                            <p className="text-[11px] text-textSecondary">@{req.user?.username}</p>
                            {req.message && (
                              <p className="text-xs text-textPrimary/90 bg-surface/80 p-2 rounded-md border border-borderTheme/50 mt-1 italic">
                                "{req.message}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApproveRequest(req._id)}
                            className="gap-1 bg-success hover:bg-success/90 text-white shadow-soft text-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectRequest(req._id)}
                            className="gap-1 border-danger/30 text-danger hover:bg-danger/10 text-xs"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Invite Member Card */}
              <div className="space-y-4">
                <h3 className="text-sm font-heading font-bold text-textPrimary flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-primary" />
                  <span>Invite Member</span>
                </h3>

                <Card className="p-4 sm:p-5 bg-card border-[1.5px] border-borderTheme space-y-3 shadow-soft">
                  <p className="text-xs text-textSecondary leading-relaxed">
                    Directly invite any learner to join your private community.
                  </p>

                  <form onSubmit={handleSendInvite} className="space-y-3 pt-1">
                    <div>
                      <label className="text-[11px] font-heading font-bold text-textSecondary mb-1 block">
                        Username
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. priya_algo"
                        value={inviteUsername}
                        onChange={(e) => setInviteUsername(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-borderTheme text-textPrimary placeholder:text-textSecondary/50 focus:outline-hidden focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-heading font-bold text-textSecondary mb-1 block">
                        Custom Note (Optional)
                      </label>
                      <textarea
                        placeholder="Join our private algorithm study group..."
                        value={inviteMessage}
                        onChange={(e) => setInviteMessage(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-borderTheme text-textPrimary placeholder:text-textSecondary/50 focus:outline-hidden focus:border-primary resize-none"
                      />
                    </div>

                    {inviteNotice.text && (
                      <div className={`p-2 rounded-md text-xs font-body ${inviteNotice.type === 'success' ? 'bg-success/15 text-success border border-success/30' : 'bg-danger/15 text-danger border border-danger/30'}`}>
                        {inviteNotice.text}
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={isInviting || !inviteUsername.trim()}
                      className="w-full gap-1.5 text-xs font-heading font-bold"
                    >
                      {isInviting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>{isInviting ? 'Sending Invite...' : 'Send Invitation'}</span>
                    </Button>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={isCreatePostOpen}
          onClose={() => setIsCreatePostOpen(false)}
          communityId={community.slug || community.id || community._id}
          onPostCreated={handlePostCreated}
        />
      </div>
    </AppLayout>
  );
};

export default CommunityDetail;

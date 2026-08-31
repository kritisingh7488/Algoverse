import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Clock,
  Eye,
  Trash2,
  Check,
  User,
  Shield,
  ChevronRight,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import MarkdownRenderer from '../components/common/MarkdownRenderer';
import PostTypeBadge from '../components/community/PostTypeBadge';
import PostReactionBar from '../components/community/PostReactionBar';
import CommentsSection from '../components/community/CommentsSection';
import communityService from '../api/communityService';

export const PostDetail = () => {
  const { communityId, postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setErrorStatus(null);

      try {
        const res = await communityService.getPostById(postId);
        if (res.success && res.data) {
          setPost(res.data);
          setIsBookmarked(res.data.isBookmarked || false);
        } else {
          setErrorStatus(res.status || 404);
        }
      } catch (err) {
        setErrorStatus(err.response?.status || 500);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleBookmarkToggle = async () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    try {
      await communityService.bookmarkPost(postId);
    } catch (err) {
      setIsBookmarked(!nextState);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post and all its comments?')) return;

    setIsDeleting(true);
    try {
      await communityService.deletePost(postId);
      navigate(`/community/${communityId || post?.community?.slug}`);
    } catch (err) {
      console.error('Failed to delete post:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-textSecondary">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs sm:text-sm font-heading font-semibold">Loading discussion...</p>
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
            Private Community Post
          </h2>
          <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
            This discussion belongs to a private guild. You must be an approved member to view details and replies.
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <Link to={`/community/${communityId}`}>
              <Button variant="outline" size="md" className="gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Guild Overview</span>
              </Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!post || errorStatus === 404) {
    return (
      <AppLayout>
        <div className="py-16 max-w-lg mx-auto text-center space-y-4 font-body">
          <div className="w-14 h-14 rounded-3xl bg-danger/15 border border-danger/25 flex items-center justify-center text-danger mx-auto text-2xl shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-heading font-bold text-textPrimary">
            Post Not Found
          </h2>
          <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
            This discussion may have been removed by its author or does not exist.
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <Link to={`/community/${communityId || ''}`}>
              <Button variant="primary" size="md" className="gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Community</span>
              </Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const commSlug = communityId || post.community?.slug || 'general';
  const commName = post.community?.name || 'Community';
  const authorName = post.author?.fullName || post.author?.username || 'Learner';
  const authorRole = post.author?.role === 'admin' ? 'Platform Admin' : 'Guild Contributor';
  const authorAvatar = post.author?.avatar;
  const authorXp = post.author?.xp || 120;

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently';

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-5 font-body pb-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-xs text-textSecondary font-heading flex-wrap">
          <Link to="/community" className="hover:text-textPrimary transition-colors">
            Communities
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <Link to={`/community/${commSlug}`} className="hover:text-textPrimary transition-colors truncate max-w-[160px]">
            {commName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-primary font-bold truncate max-w-[200px]">{post.title}</span>
        </div>

        {/* Back Link */}
        <Link
          to={`/community/${commSlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-textSecondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {commName} Discussions</span>
        </Link>

        {/* Main Post Card */}
        <Card className="bg-card border-[1.5px] border-borderTheme p-5 sm:p-7 shadow-soft space-y-5">
          {/* Post Header */}
          <div className="space-y-3 pb-4 border-b border-borderTheme">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <PostTypeBadge type={post.postType} size="sm" />
                <span className="text-xs text-textSecondary flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Posted {formattedDate}</span>
                  {post.isEdited && <span className="italic opacity-70">(edited)</span>}
                </span>
              </div>

              {/* Top Action Buttons */}
              <div className="flex items-center gap-1.5 text-textSecondary">
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-lg hover:bg-surface text-textSecondary hover:text-textPrimary transition-colors border border-borderTheme flex items-center gap-1 text-xs"
                  title="Share discussion"
                >
                  {copiedShare ? <Check className="w-3.5 h-3.5 text-success" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copiedShare ? 'Copied Link' : 'Share'}</span>
                </button>

                <button
                  onClick={handleBookmarkToggle}
                  className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-xs ${
                    isBookmarked
                      ? 'bg-primary/15 text-primary border-primary/30'
                      : 'hover:bg-surface text-textSecondary hover:text-textPrimary border-borderTheme'
                  }`}
                  title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Post'}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={handleDeletePost}
                  disabled={isDeleting}
                  className="p-1.5 rounded-lg hover:bg-danger/15 text-textSecondary hover:text-danger transition-colors border border-borderTheme"
                  title="Delete post"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Post Title */}
            <h1 className="text-lg sm:text-2xl font-heading font-bold text-textPrimary leading-snug">
              {post.title}
            </h1>

            {/* Author Strip */}
            <div className="flex items-center gap-3 pt-1">
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-10 h-10 rounded-full object-cover border border-borderTheme shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                  {authorName[0]?.toUpperCase() || <User className="w-5 h-5" />}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-heading font-bold text-textPrimary">
                    {authorName}
                  </span>
                  <span className="text-[10px] text-primary px-1.5 py-0.2 rounded-full bg-primary/10 border border-primary/20 font-semibold">
                    {authorRole}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-textSecondary">
                  <span>@{post.author?.username || 'learner'}</span>
                  <span>•</span>
                  <span className="text-secondary font-semibold">{authorXp} XP</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 opacity-70" />
                    <span>{(post.viewsCount || 1).toLocaleString()} views</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Markdown Rendered Content */}
          <div className="py-2 text-textPrimary leading-relaxed">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Tags List */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-3 flex flex-wrap gap-1.5 border-t border-borderTheme">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-surface text-xs font-heading font-medium text-textSecondary border border-borderTheme"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Reactions Bar Section */}
          <div className="pt-4 border-t border-borderTheme space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-textSecondary">
                Reactions & Insight
              </span>
              <span className="text-xs text-textSecondary">
                Total Reactions: <strong className="text-textPrimary">{post.reactionsCount || 0}</strong>
              </span>
            </div>
            <PostReactionBar
              postId={postId}
              initialReaction={post.userReaction}
              initialSummary={post.reactionsSummary}
              totalCount={post.reactionsCount}
              onReactionChange={(updated) => {
                setPost(prev => ({
                  ...prev,
                  reactionsCount: updated.reactionsCount,
                  reactionsSummary: updated.reactionsSummary
                }));
              }}
            />
          </div>
        </Card>

        {/* Comments Section */}
        <CommentsSection postId={postId} />
      </div>
    </AppLayout>
  );
};

export default PostDetail;

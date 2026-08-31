import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Eye, Bookmark, Clock, User, Pin, CheckCircle2 } from 'lucide-react';
import Card from '../common/Card';
import PostTypeBadge from './PostTypeBadge';
import communityService from '../../api/communityService';

export const PostCard = ({ post, communityId, showCommunity = false }) => {
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const commSlug = communityId || (post.community ? (post.community.slug || post.community._id || post.community) : 'general');
  const postId = post._id || post.id;
  const postUrl = `/community/${commSlug}/post/${postId}`;

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBookmarking) return;

    setIsBookmarking(true);
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    try {
      await communityService.bookmarkPost(postId);
    } catch (err) {
      setIsBookmarked(!nextState);
    } finally {
      setIsBookmarking(false);
    }
  };

  // Format date helper
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: new Date(post.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      })
    : 'Recently';

  // Summary of top reactions
  const summary = post.reactionsSummary || {};
  const topReactions = [];
  if (summary.like > 0) topReactions.push('👍');
  if (summary.love > 0) topReactions.push('❤️');
  if (summary.insightful > 0) topReactions.push('💡');
  if (summary.helpful > 0) topReactions.push('🤝');
  if (summary.celebrate > 0) topReactions.push('🎉');

  const authorName = post.author?.fullName || post.author?.username || 'Learner';
  const authorRole = post.author?.role === 'admin' ? 'Platform Admin' : 'Member';
  const authorAvatar = post.author?.avatar;

  // Clean preview text
  const cleanExcerpt = (post.content || '')
    .replace(/[#*`_~\[\]]/g, '')
    .slice(0, 160)
    .trim() + (post.content && post.content.length > 160 ? '...' : '');

  return (
    <Card className="bg-card border-[1.5px] border-borderTheme hover:border-primary/40 transition-all shadow-soft p-4 sm:p-5 group">
      <div className="space-y-3">
        {/* Header: Author + Post Type + Pin/Solved */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-8 h-8 rounded-full object-cover border border-borderTheme shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0 border border-primary/20">
                {authorName[0]?.toUpperCase() || <User className="w-4 h-4" />}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-heading font-bold text-textPrimary truncate">
                  {authorName}
                </span>
                <span className="text-[10px] text-textSecondary px-1.5 py-0.2 rounded bg-surface border border-borderTheme">
                  {authorRole}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-textSecondary">
                <Clock className="w-3 h-3" />
                <span>{formattedDate}</span>
                {post.isEdited && <span className="italic opacity-70">(edited)</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {post.isPinned && (
              <span className="flex items-center gap-1 text-[10px] font-heading font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                <Pin className="w-3 h-3" />
                <span className="hidden sm:inline">Pinned</span>
              </span>
            )}
            {post.isSolved && (
              <span className="flex items-center gap-1 text-[10px] font-heading font-semibold text-emerald-500 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span className="hidden sm:inline">Solved</span>
              </span>
            )}
            <PostTypeBadge type={post.postType} size="xs" />
          </div>
        </div>

        {/* Post Title & Excerpt */}
        <Link to={postUrl} className="block group-hover:text-primary transition-colors space-y-1.5">
          <h3 className="text-sm sm:text-base font-heading font-bold text-textPrimary group-hover:text-primary leading-snug line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-textSecondary font-body leading-relaxed line-clamp-2">
            {cleanExcerpt}
          </p>
        </Link>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-surface text-[11px] font-heading font-medium text-textSecondary border border-borderTheme hover:border-primary/30 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer: Stats & Bookmark */}
        <div className="pt-2 flex items-center justify-between border-t border-borderTheme text-xs text-textSecondary">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Reactions Summary */}
            <div className="flex items-center gap-1">
              {topReactions.length > 0 && (
                <span className="flex items-center -space-x-1 text-xs">
                  {topReactions.slice(0, 3).map((emoji, i) => (
                    <span key={i}>{emoji}</span>
                  ))}
                </span>
              )}
              <span className="font-heading font-semibold text-[11px]">
                {post.reactionsCount || 0}
              </span>
            </div>

            {/* Comments count */}
            <Link to={postUrl} className="flex items-center gap-1 hover:text-textPrimary transition-colors">
              <MessageSquare className="w-3.5 h-3.5 text-secondary" />
              <span className="font-heading font-semibold text-[11px]">
                {post.commentsCount || 0}
              </span>
              <span className="hidden sm:inline text-[11px]">comments</span>
            </Link>

            {/* Views count */}
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-textSecondary opacity-70" />
              <span className="text-[11px]">{(post.viewsCount || 0).toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handleBookmarkToggle}
            disabled={isBookmarking}
            className={`p-1.5 rounded-lg border transition-all ${
              isBookmarked
                ? 'bg-primary/15 text-primary border-primary/30'
                : 'hover:bg-surface text-textSecondary hover:text-textPrimary border-transparent hover:border-borderTheme'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Post'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;

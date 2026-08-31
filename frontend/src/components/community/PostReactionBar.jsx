import React, { useState } from 'react';
import { ThumbsUp, Heart, Lightbulb, Handshake, Sparkles } from 'lucide-react';
import communityService from '../../api/communityService';

const REACTIONS = [
  { id: 'like', label: 'Like', emoji: '👍', icon: ThumbsUp, color: 'text-blue-500 hover:bg-blue-500/10' },
  { id: 'love', label: 'Love', emoji: '❤️', icon: Heart, color: 'text-rose-500 hover:bg-rose-500/10' },
  { id: 'insightful', label: 'Insightful', emoji: '💡', icon: Lightbulb, color: 'text-amber-500 hover:bg-amber-500/10' },
  { id: 'helpful', label: 'Helpful', emoji: '🤝', icon: Handshake, color: 'text-emerald-500 hover:bg-emerald-500/10' },
  { id: 'celebrate', label: 'Celebrate', emoji: '🎉', icon: Sparkles, color: 'text-purple-500 hover:bg-purple-500/10' }
];

export const PostReactionBar = ({ postId, initialReaction = null, initialSummary = {}, totalCount = 0, onReactionChange }) => {
  const [currentReaction, setCurrentReaction] = useState(initialReaction);
  const [summary, setSummary] = useState(initialSummary || {});
  const [count, setCount] = useState(totalCount || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReact = async (type) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const prevReaction = currentReaction;
    const isToggleOff = prevReaction === type;
    const nextReaction = isToggleOff ? null : type;

    // Optimistic UI update
    setCurrentReaction(nextReaction);
    const updatedSummary = { ...(summary || {}) };
    let newCount = count;

    if (prevReaction) {
      updatedSummary[prevReaction] = Math.max(0, (updatedSummary[prevReaction] || 1) - 1);
      newCount--;
    }
    if (nextReaction) {
      updatedSummary[nextReaction] = (updatedSummary[nextReaction] || 0) + 1;
      newCount++;
    }

    setSummary(updatedSummary);
    setCount(newCount);

    try {
      const res = await communityService.reactToPost(postId, type);
      if (res.data) {
        setSummary(res.data.reactionsSummary || updatedSummary);
        setCount(res.data.reactionsCount !== undefined ? res.data.reactionsCount : newCount);
        if (onReactionChange) onReactionChange(res.data);
      }
    } catch (err) {
      console.error('Failed to react:', err);
      // Rollback on failure
      setCurrentReaction(prevReaction);
      setSummary(initialSummary);
      setCount(totalCount);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      {REACTIONS.map(r => {
        const isActive = currentReaction === r.id;
        const reactionCount = summary[r.id] || 0;

        return (
          <button
            key={r.id}
            onClick={() => handleReact(r.id)}
            disabled={isSubmitting}
            title={`${r.label} (${reactionCount})`}
            className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-heading font-semibold transition-all border ${
              isActive
                ? 'bg-primary/15 text-primary border-primary/30 shadow-xs scale-105'
                : 'bg-surface hover:bg-surface/80 text-textSecondary hover:text-textPrimary border-borderTheme'
            } ${r.color}`}
          >
            <span className="text-sm leading-none">{r.emoji}</span>
            <span className="hidden sm:inline text-[11px]">{r.label}</span>
            {reactionCount > 0 && (
              <span className={`text-[10px] px-1 rounded-full ${isActive ? 'bg-primary/20 text-primary' : 'bg-card text-textSecondary'}`}>
                {reactionCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PostReactionBar;

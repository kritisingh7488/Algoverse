import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, CornerDownRight, Trash2, Edit2, Check, X, Clock, User } from 'lucide-react';
import MarkdownRenderer from '../common/MarkdownRenderer';
import Button from '../common/Button';
import communityService from '../../api/communityService';

export const CommentItem = ({ comment, postId, onCommentAdded, onCommentDeleted, level = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content || '');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);

  const commentId = comment._id || comment.id;
  const authorName = comment.author?.fullName || comment.author?.username || 'Learner';
  const authorRole = comment.author?.role === 'admin' ? 'Admin' : 'Member';
  const authorAvatar = comment.author?.avatar;

  const formattedDate = comment.createdAt
    ? new Date(comment.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Just now';

  const handleLike = async () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount(prev => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await communityService.likeComment(commentId);
    } catch (err) {
      setIsLiked(!nextState);
      setLikesCount(prev => (!nextState ? prev + 1 : Math.max(0, prev - 1)));
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);
    try {
      const res = await communityService.createComment(postId, {
        content: replyText.trim(),
        parentCommentId: commentId
      });

      if (res.success && res.data) {
        setReplyText('');
        setIsReplying(false);
        if (onCommentAdded) onCommentAdded(res.data);
      }
    } catch (err) {
      console.error('Failed to post reply:', err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editText.trim() || isSubmittingEdit) return;

    setIsSubmittingEdit(true);
    try {
      const res = await communityService.updateComment(commentId, editText.trim());
      if (res.success) {
        comment.content = editText.trim();
        comment.isEdited = true;
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to edit comment:', err);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await communityService.deleteComment(commentId);
      if (onCommentDeleted) onCommentDeleted(commentId);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  return (
    <div className={`space-y-3 ${level > 0 ? 'ml-3 sm:ml-6 pl-3 sm:pl-4 border-l-2 border-borderTheme/80' : ''}`}>
      <div className="p-3.5 sm:p-4 rounded-xl bg-surface/70 border border-borderTheme space-y-2.5 hover:border-primary/25 transition-all">
        {/* Author Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-6 h-6 rounded-full object-cover border border-borderTheme shrink-0"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 border border-primary/20">
                {authorName[0]?.toUpperCase() || <User className="w-3 h-3" />}
              </div>
            )}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="font-heading font-bold text-textPrimary">{authorName}</span>
              <span className="text-[10px] text-textSecondary px-1.5 py-0.2 rounded bg-card border border-borderTheme">
                {authorRole}
              </span>
              <span className="text-[11px] text-textSecondary flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                <span>{formattedDate}</span>
              </span>
              {comment.isEdited && <span className="text-[10px] text-textSecondary italic">(edited)</span>}
            </div>
          </div>

          <div className="flex items-center gap-1 text-textSecondary">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1 rounded hover:bg-card text-textSecondary hover:text-textPrimary transition-colors"
              title="Edit comment"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 rounded hover:bg-danger/15 text-textSecondary hover:text-danger transition-colors"
              title="Delete comment"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Comment Content or Edit Mode */}
        {isEditing ? (
          <div className="space-y-2 pt-1">
            <textarea
              rows={3}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-card border border-borderTheme focus:border-primary focus:outline-hidden text-xs font-mono text-textPrimary leading-relaxed"
            />
            <div className="flex justify-end gap-1.5">
              <Button size="xs" variant="outline" onClick={() => setIsEditing(false)}>
                <X className="w-3 h-3" />
                <span>Cancel</span>
              </Button>
              <Button size="xs" variant="primary" onClick={handleEditSubmit} disabled={isSubmittingEdit}>
                <Check className="w-3 h-3" />
                <span>Save</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-xs text-textSecondary font-body leading-relaxed pl-1">
            <MarkdownRenderer content={comment.content} />
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center gap-3 pt-1 text-xs text-textSecondary font-heading font-semibold">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
              isLiked ? 'text-primary bg-primary/10' : 'hover:text-textPrimary hover:bg-card'
            }`}
          >
            <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount > 0 ? likesCount : 'Like'}</span>
          </button>

          <button
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:text-textPrimary hover:bg-card transition-colors"
          >
            <MessageSquare className="w-3 h-3 text-secondary" />
            <span>Reply</span>
          </button>
        </div>

        {/* Inline Reply Input */}
        {isReplying && (
          <form onSubmit={handleReplySubmit} className="pt-2 space-y-2 border-t border-borderTheme animate-in fade-in">
            <div className="flex items-start gap-2">
              <CornerDownRight className="w-4 h-4 text-primary mt-2 shrink-0" />
              <textarea
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Replying to ${authorName}...`}
                className="w-full p-2.5 rounded-xl bg-card border border-borderTheme focus:border-primary focus:outline-hidden text-xs text-textPrimary placeholder:text-textSecondary/60"
              />
            </div>
            <div className="flex justify-end gap-1.5 pl-6">
              <Button size="xs" variant="outline" type="button" onClick={() => setIsReplying(false)}>
                Cancel
              </Button>
              <Button size="xs" variant="primary" type="submit" disabled={isSubmittingReply || !replyText.trim()}>
                {isSubmittingReply ? 'Posting...' : 'Post Reply'}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Recursive Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id || reply.id}
              comment={reply}
              postId={postId}
              onCommentAdded={onCommentAdded}
              onCommentDeleted={onCommentDeleted}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;

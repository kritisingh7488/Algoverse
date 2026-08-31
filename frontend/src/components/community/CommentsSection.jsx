import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import CommentItem from './CommentItem';
import communityService from '../../api/communityService';

export const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await communityService.getComments(postId);
      if (res.success && Array.isArray(res.data)) {
        setComments(res.data);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || isSubmitting) return;

    setError('');
    setIsSubmitting(true);
    try {
      const res = await communityService.createComment(postId, {
        content: newCommentText.trim()
      });

      if (res.success && res.data) {
        setNewCommentText('');
        // Append new top-level comment
        setComments(prev => [...prev, res.data]);
      } else {
        setError(res.message || 'Failed to post comment');
      }
    } catch (err) {
      setError(err.message || 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNestedCommentAdded = () => {
    // Refresh the threaded tree to ensure accurate nesting
    fetchComments();
  };

  const handleCommentDeleted = (deletedId) => {
    setComments(prev => prev.filter(c => (c._id || c.id) !== deletedId));
  };

  return (
    <Card className="bg-card border-[1.5px] border-borderTheme p-5 sm:p-6 shadow-soft space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-borderTheme">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center font-bold text-sm">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-heading font-bold text-textPrimary">
              Discussion & Answers ({comments.length})
            </h3>
            <p className="text-xs text-textSecondary font-body">
              Join the conversation. Be helpful, constructive, and cite complexities.
            </p>
          </div>
        </div>
      </div>

      {/* New Top-Level Comment Input */}
      <form onSubmit={handlePostComment} className="space-y-3">
        {error && (
          <div className="p-3 rounded-xl bg-danger/10 border border-danger/25 text-danger text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div className="relative">
          <textarea
            rows={3}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Share your thoughts, solution approach, code feedback, or ask for clarification..."
            className="w-full p-3.5 rounded-xl bg-surface border border-borderTheme focus:border-primary focus:outline-hidden text-xs sm:text-sm font-body text-textPrimary placeholder:text-textSecondary/60 transition-colors resize-y leading-relaxed"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-textSecondary flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>Markdown supported (```code```, **bold**, lists)</span>
          </span>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting || !newCommentText.trim()}
            className="gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 pt-2">
        {loading ? (
          <div className="py-10 flex flex-col items-center justify-center gap-2 text-textSecondary">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-xs font-heading">Loading comments...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="py-10 text-center space-y-2 border border-dashed border-borderTheme rounded-xl p-6 bg-surface/30">
            <div className="text-2xl">💬</div>
            <h4 className="text-xs font-heading font-bold text-textPrimary">No comments yet</h4>
            <p className="text-xs text-textSecondary font-body max-w-sm mx-auto">
              Be the first to share an answer, intuitive breakdown, or solution review!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id || comment.id}
              comment={comment}
              postId={postId}
              onCommentAdded={handleNestedCommentAdded}
              onCommentDeleted={handleCommentDeleted}
              level={0}
            />
          ))
        )}
      </div>
    </Card>
  );
};

export default CommentsSection;

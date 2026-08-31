const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

/**
 * Format a comment with viewer's like state
 */
const formatCommentResponse = (commDoc, currentUserId) => {
    const comm = commDoc.toObject ? commDoc.toObject() : { ...commDoc };
    const uid = currentUserId ? currentUserId.toString() : null;

    if (uid && comm.likes && comm.likes.length > 0) {
        comm.isLiked = comm.likes.some(l => (l._id ? l._id.toString() : l.toString()) === uid);
    } else {
        comm.isLiked = false;
    }

    return comm;
};

/**
 * Build a threaded comment tree from flat array of comments
 */
const buildCommentTree = (comments, currentUserId) => {
    const commentMap = {};
    const roots = [];

    // Format all comments first
    comments.forEach(c => {
        const formatted = formatCommentResponse(c, currentUserId);
        formatted.replies = [];
        commentMap[formatted._id.toString()] = formatted;
    });

    // Nest replies
    comments.forEach(c => {
        const id = c._id.toString();
        if (c.parentComment) {
            const parentId = (c.parentComment._id ? c.parentComment._id.toString() : c.parentComment.toString());
            if (commentMap[parentId]) {
                commentMap[parentId].replies.push(commentMap[id]);
            } else {
                roots.push(commentMap[id]);
            }
        } else {
            roots.push(commentMap[id]);
        }
    });

    return roots;
};

/**
 * @route   GET /api/v1/posts/:postId/comments
 * @desc    Get threaded comments for a post
 * @access  Public (Optional auth)
 */
exports.getPostComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const currentUserId = req.user ? req.user._id : null;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const comments = await Comment.find({ post: postId })
            .sort({ createdAt: 1 })
            .populate('author', 'fullName username avatar role xp');

        const tree = buildCommentTree(comments, currentUserId);

        return res.status(200).json({
            success: true,
            count: comments.length,
            data: tree
        });
    } catch (error) {
        console.error('Error fetching post comments:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while retrieving comments',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/v1/posts/:postId/comments
 * @desc    Add a comment or nested reply to a post
 * @access  Private
 */
exports.createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, parentCommentId } = req.body;
        const userId = req.user._id;

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Comment content is required'
            });
        }

        if (content.trim().length > 3000) {
            return res.status(400).json({
                success: false,
                message: 'Comment cannot exceed 3,000 characters'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        let parentComment = null;
        if (parentCommentId) {
            if (!mongoose.Types.ObjectId.isValid(parentCommentId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid parent comment ID'
                });
            }

            parentComment = await Comment.findById(parentCommentId);
            if (!parentComment || parentComment.post.toString() !== post._id.toString()) {
                return res.status(404).json({
                    success: false,
                    message: 'Parent comment not found on this post'
                });
            }
        }

        const newComment = new Comment({
            author: userId,
            post: post._id,
            community: post.community,
            content: content.trim(),
            parentComment: parentComment ? parentComment._id : null,
            replyCount: 0,
            likes: [],
            likesCount: 0
        });

        await newComment.save();

        // Increment post comments count
        post.commentsCount = (post.commentsCount || 0) + 1;
        await post.save();

        // If reply, increment parent's replyCount
        if (parentComment) {
            parentComment.replyCount = (parentComment.replyCount || 0) + 1;
            await parentComment.save();
        }

        const populated = await Comment.findById(newComment._id)
            .populate('author', 'fullName username avatar role xp');

        const formatted = formatCommentResponse(populated, userId);
        formatted.replies = [];

        return res.status(201).json({
            success: true,
            message: 'Comment posted successfully',
            data: formatted
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while creating comment',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/v1/comments/:commentId
 * @desc    Edit a comment
 * @access  Private (Author only)
 */
exports.updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Comment content cannot be empty'
            });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Authorization check: Author only
        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to edit this comment'
            });
        }

        comment.content = content.trim();
        comment.isEdited = true;
        await comment.save();

        const populated = await Comment.findById(comment._id)
            .populate('author', 'fullName username avatar role xp');

        return res.status(200).json({
            success: true,
            message: 'Comment updated successfully',
            data: formatCommentResponse(populated, userId)
        });
    } catch (error) {
        console.error('Error updating comment:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while updating comment',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/v1/comments/:commentId
 * @desc    Delete a comment and its replies
 * @access  Private (Author / Community Owner / Platform Admin)
 */
exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;
        const isAdmin = req.user.role === 'admin';

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        const comment = await Comment.findById(commentId).populate('community', 'creator');
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        const isAuthor = comment.author.toString() === userId.toString();
        const isCommunityOwner = comment.community && comment.community.creator.toString() === userId.toString();

        if (!isAuthor && !isCommunityOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this comment'
            });
        }

        // Count all nested descendant replies to adjust post.commentsCount accurately
        const childReplies = await Comment.find({ parentComment: comment._id });
        const totalDeleted = 1 + childReplies.length;

        // Decrement parent replyCount if applicable
        if (comment.parentComment) {
            await Comment.findByIdAndUpdate(comment.parentComment, {
                $inc: { replyCount: -1 }
            });
        }

        // Decrement post commentsCount
        await Post.findByIdAndUpdate(comment.post, {
            $inc: { commentsCount: -totalDeleted }
        });

        // Delete children and comment
        await Comment.deleteMany({ parentComment: comment._id });
        await Comment.findByIdAndDelete(comment._id);

        return res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while deleting comment',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/v1/comments/:commentId/like
 * @desc    Toggle like on a comment
 * @access  Private
 */
exports.likeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        const isLiked = comment.likes.some(l => l.toString() === userId.toString());
        if (isLiked) {
            comment.likes = comment.likes.filter(l => l.toString() !== userId.toString());
        } else {
            comment.likes.push(userId);
        }

        comment.likesCount = comment.likes.length;
        await comment.save();

        const populated = await Comment.findById(comment._id)
            .populate('author', 'fullName username avatar role xp');

        return res.status(200).json({
            success: true,
            message: isLiked ? 'Comment unliked' : 'Comment liked',
            isLiked: !isLiked,
            data: formatCommentResponse(populated, userId)
        });
    } catch (error) {
        console.error('Error toggling comment like:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while liking comment',
            error: error.message
        });
    }
};

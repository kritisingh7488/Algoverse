const mongoose = require('mongoose');
const Post = require('../models/Post');
const Community = require('../models/Community');
const Comment = require('../models/Comment');

/**
 * Format a post document for client response with viewer-specific state
 */
const formatPostResponse = (postDoc, currentUserId) => {
    const post = postDoc.toObject ? postDoc.toObject() : { ...postDoc };
    const uid = currentUserId ? currentUserId.toString() : null;

    if (uid && post.reactions && post.reactions.length > 0) {
        const userReactionObj = post.reactions.find(r => (r.user._id ? r.user._id.toString() : r.user.toString()) === uid);
        post.userReaction = userReactionObj ? userReactionObj.type : null;
    } else {
        post.userReaction = null;
    }

    if (uid && post.bookmarks && post.bookmarks.length > 0) {
        post.isBookmarked = post.bookmarks.some(b => (b._id ? b._id.toString() : b.toString()) === uid);
    } else {
        post.isBookmarked = false;
    }

    return post;
};

/**
 * Helper to resolve Community by ID or Slug
 */
const findCommunityByIdOrSlug = async (idOrSlug) => {
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    const query = isObjectId ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] } : { slug: idOrSlug };
    return await Community.findOne(query);
};

/**
 * @route   GET /api/v1/communities/:communityId/posts
 * @desc    Get all posts for a community with search, tag, type filters & sorting
 * @access  Public (or Private for private communities)
 */
exports.getCommunityPosts = async (req, res) => {
    try {
        const { communityId } = req.params;
        const { postType, tag, search, sort = 'newest', page = 1, limit = 20 } = req.query;
        const currentUserId = req.user ? req.user._id : null;

        const community = await findCommunityByIdOrSlug(communityId);
        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        // Privacy check
        if (community.isPrivate) {
            const isMember = currentUserId && community.members.some(m => m.toString() === currentUserId.toString());
            const isCreator = currentUserId && community.creator.toString() === currentUserId.toString();
            const isAdmin = req.user && req.user.role === 'admin';

            if (!isMember && !isCreator && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'Access restricted to private community members'
                });
            }
        }

        const query = { community: community._id };

        // Post type filter
        if (postType && postType !== 'All') {
            query.postType = postType;
        }

        // Tag filter
        if (tag && tag.trim()) {
            query.tags = tag.trim().toLowerCase();
        }

        // Search query filter
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [
                { title: searchRegex },
                { content: searchRegex },
                { tags: searchRegex }
            ];
        }

        // Sorting options
        let sortOption = {};
        if (sort === 'popular') {
            sortOption = { isPinned: -1, reactionsCount: -1, createdAt: -1 };
        } else if (sort === 'most_commented') {
            sortOption = { isPinned: -1, commentsCount: -1, createdAt: -1 };
        } else {
            // newest
            sortOption = { isPinned: -1, createdAt: -1 };
        }

        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10) || 20));
        const skip = (pageNum - 1) * limitNum;

        const [posts, total] = await Promise.all([
            Post.find(query)
                .sort(sortOption)
                .skip(skip)
                .limit(limitNum)
                .populate('author', 'fullName username avatar role xp')
                .populate('community', 'name slug icon gradient category isPrivate'),
            Post.countDocuments(query)
        ]);

        const formatted = posts.map(p => formatPostResponse(p, currentUserId));

        return res.status(200).json({
            success: true,
            count: formatted.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum) || 1,
            data: formatted
        });
    } catch (error) {
        console.error('Error fetching community posts:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while retrieving posts',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/v1/posts/feed
 * @desc    Get global discussion feed across public communities
 * @access  Public
 */
exports.getGlobalFeed = async (req, res) => {
    try {
        const { postType, tag, search, sort = 'newest', page = 1, limit = 20 } = req.query;
        const currentUserId = req.user ? req.user._id : null;

        // Only include posts from public communities
        const publicCommunities = await Community.find({ isPrivate: false }).select('_id');
        const publicIds = publicCommunities.map(c => c._id);

        const query = { community: { $in: publicIds } };

        if (postType && postType !== 'All') {
            query.postType = postType;
        }

        if (tag && tag.trim()) {
            query.tags = tag.trim().toLowerCase();
        }

        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [
                { title: searchRegex },
                { content: searchRegex },
                { tags: searchRegex }
            ];
        }

        let sortOption = {};
        if (sort === 'popular') {
            sortOption = { reactionsCount: -1, createdAt: -1 };
        } else if (sort === 'most_commented') {
            sortOption = { commentsCount: -1, createdAt: -1 };
        } else {
            sortOption = { createdAt: -1 };
        }

        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10) || 20));
        const skip = (pageNum - 1) * limitNum;

        const [posts, total] = await Promise.all([
            Post.find(query)
                .sort(sortOption)
                .skip(skip)
                .limit(limitNum)
                .populate('author', 'fullName username avatar role xp')
                .populate('community', 'name slug icon gradient category isPrivate'),
            Post.countDocuments(query)
        ]);

        const formatted = posts.map(p => formatPostResponse(p, currentUserId));

        return res.status(200).json({
            success: true,
            count: formatted.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum) || 1,
            data: formatted
        });
    } catch (error) {
        console.error('Error fetching global feed:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while retrieving global feed',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/v1/posts/:postId
 * @desc    Get single post details and increment views count
 * @access  Public (Optional auth)
 */
exports.getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const currentUserId = req.user ? req.user._id : null;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Atomically increment views count
        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { viewsCount: 1 } },
            { new: true }
        )
        .populate('author', 'fullName username avatar role xp')
        .populate('community', 'name slug icon gradient category isPrivate members creator');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Privacy check on parent community
        if (post.community && post.community.isPrivate) {
            const isMember = currentUserId && post.community.members.some(m => m.toString() === currentUserId.toString());
            const isCreator = currentUserId && post.community.creator.toString() === currentUserId.toString();
            const isAdmin = req.user && req.user.role === 'admin';

            if (!isMember && !isCreator && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'Access restricted to private community members'
                });
            }
        }

        const formatted = formatPostResponse(post, currentUserId);

        return res.status(200).json({
            success: true,
            data: formatted
        });
    } catch (error) {
        console.error('Error fetching post details:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while retrieving post',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/v1/communities/:communityId/posts
 * @desc    Create a new post in a community
 * @access  Private
 */
exports.createPost = async (req, res) => {
    try {
        const { communityId } = req.params;
        const { title, content, postType = 'Discussion', tags = [] } = req.body;
        const userId = req.user._id;

        // Validation
        if (!title || typeof title !== 'string' || title.trim().length < 5) {
            return res.status(400).json({
                success: false,
                message: 'Post title must be at least 5 characters long'
            });
        }

        if (title.trim().length > 150) {
            return res.status(400).json({
                success: false,
                message: 'Post title cannot exceed 150 characters'
            });
        }

        if (!content || typeof content !== 'string' || content.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Post content must be at least 10 characters long'
            });
        }

        if (content.trim().length > 10000) {
            return res.status(400).json({
                success: false,
                message: 'Post content cannot exceed 10,000 characters'
            });
        }

        const community = await findCommunityByIdOrSlug(communityId);
        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        // Privacy check: If private community, only members/creator can post
        if (community.isPrivate) {
            const isMember = community.members.some(m => m.toString() === userId.toString());
            const isCreator = community.creator.toString() === userId.toString();
            const isAdmin = req.user.role === 'admin';

            if (!isMember && !isCreator && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'You must be a member of this private community to post'
                });
            }
        }

        const parsedTags = Array.isArray(tags)
            ? tags.map(t => typeof t === 'string' ? t.trim().toLowerCase() : '').filter(Boolean)
            : [];

        const newPost = new Post({
            title: title.trim(),
            content: content.trim(),
            author: userId,
            community: community._id,
            postType,
            tags: parsedTags,
            reactions: [],
            reactionsCount: 0,
            reactionsSummary: { like: 0, love: 0, insightful: 0, helpful: 0, celebrate: 0 },
            commentsCount: 0,
            viewsCount: 0,
            bookmarks: []
        });

        await newPost.save();

        const populated = await Post.findById(newPost._id)
            .populate('author', 'fullName username avatar role xp')
            .populate('community', 'name slug icon gradient category isPrivate');

        const formatted = formatPostResponse(populated, userId);

        return res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: formatted
        });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while creating post',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/v1/posts/:postId
 * @desc    Update a post
 * @access  Private (Author/Admin only)
 */
exports.updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { title, content, postType, tags } = req.body;
        const userId = req.user._id;
        const isAdmin = req.user.role === 'admin';

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

        // Authorization check
        if (post.author.toString() !== userId.toString() && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to edit this post'
            });
        }

        if (title && typeof title === 'string' && title.trim().length >= 5 && title.trim().length <= 150) {
            post.title = title.trim();
        }
        if (content && typeof content === 'string' && content.trim().length >= 10 && content.trim().length <= 10000) {
            post.content = content.trim();
        }
        if (postType && ['Discussion', 'Question', 'Help', 'Code', 'Resource', 'Announcement'].includes(postType)) {
            post.postType = postType;
        }
        if (Array.isArray(tags)) {
            post.tags = tags.map(t => typeof t === 'string' ? t.trim().toLowerCase() : '').filter(Boolean);
        }

        post.isEdited = true;
        await post.save();

        const updated = await Post.findById(post._id)
            .populate('author', 'fullName username avatar role xp')
            .populate('community', 'name slug icon gradient category isPrivate');

        return res.status(200).json({
            success: true,
            message: 'Post updated successfully',
            data: formatPostResponse(updated, userId)
        });
    } catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while updating post',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/v1/posts/:postId
 * @desc    Delete a post and its comments
 * @access  Private (Author / Community Owner / Platform Admin)
 */
exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;
        const isAdmin = req.user.role === 'admin';

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const post = await Post.findById(postId).populate('community', 'creator');
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const isAuthor = post.author.toString() === userId.toString();
        const isCommunityOwner = post.community && post.community.creator.toString() === userId.toString();

        if (!isAuthor && !isCommunityOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this post'
            });
        }

        // Cascade delete all comments for this post
        await Comment.deleteMany({ post: post._id });
        await Post.findByIdAndDelete(post._id);

        return res.status(200).json({
            success: true,
            message: 'Post and associated comments deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while deleting post',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/v1/posts/:postId/react
 * @desc    Toggle or switch reaction on a post
 * @access  Private
 */
exports.reactToPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { type = 'like' } = req.body;
        const userId = req.user._id;

        const validTypes = ['like', 'love', 'insightful', 'helpful', 'celebrate'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid reaction type'
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

        const existingReactionIndex = post.reactions.findIndex(
            r => r.user.toString() === userId.toString()
        );

        if (existingReactionIndex > -1) {
            const currentReaction = post.reactions[existingReactionIndex];
            if (currentReaction.type === type) {
                // Toggle off (remove reaction)
                post.reactions.splice(existingReactionIndex, 1);
            } else {
                // Switch reaction type
                post.reactions[existingReactionIndex].type = type;
            }
        } else {
            // Add new reaction
            post.reactions.push({ user: userId, type });
        }

        // Recalculate summary & count
        const summary = { like: 0, love: 0, insightful: 0, helpful: 0, celebrate: 0 };
        post.reactions.forEach(r => {
            if (summary[r.type] !== undefined) {
                summary[r.type]++;
            }
        });

        post.reactionsSummary = summary;
        post.reactionsCount = post.reactions.length;
        await post.save();

        const updated = await Post.findById(post._id)
            .populate('author', 'fullName username avatar role xp')
            .populate('community', 'name slug icon gradient category isPrivate');

        return res.status(200).json({
            success: true,
            message: 'Reaction updated successfully',
            data: formatPostResponse(updated, userId)
        });
    } catch (error) {
        console.error('Error updating reaction:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while reacting to post',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/v1/posts/:postId/bookmark
 * @desc    Toggle bookmark status on a post
 * @access  Private
 */
exports.bookmarkPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

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

        const isBookmarked = post.bookmarks.some(b => b.toString() === userId.toString());
        if (isBookmarked) {
            post.bookmarks = post.bookmarks.filter(b => b.toString() !== userId.toString());
        } else {
            post.bookmarks.push(userId);
        }

        await post.save();

        const updated = await Post.findById(post._id)
            .populate('author', 'fullName username avatar role xp')
            .populate('community', 'name slug icon gradient category isPrivate');

        return res.status(200).json({
            success: true,
            message: isBookmarked ? 'Bookmark removed' : 'Post bookmarked',
            isBookmarked: !isBookmarked,
            data: formatPostResponse(updated, userId)
        });
    } catch (error) {
        console.error('Error toggling bookmark:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while bookmarking post',
            error: error.message
        });
    }
};

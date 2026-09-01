const express = require('express');
const router = express.Router({ mergeParams: true });
const commentRoutes = require('./commentRoutes');
const {
    getCommunityPosts,
    getGlobalFeed,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    reactToPost,
    bookmarkPost
} = require('../controllers/postController');
const { protect, optionalProtect } = require('../middleware/auth');

// Mount nested comment routes for post
router.use('/:postId/comments', commentRoutes);

// Global feed (e.g. /api/v1/posts/feed)
router.get('/feed', optionalProtect, getGlobalFeed);

// Community-scoped post routes (e.g. /api/v1/communities/:communityId/posts)
router.get('/', optionalProtect, getCommunityPosts);
router.post('/', protect, createPost);

// Direct post actions (e.g. /api/v1/posts/:postId)
router.get('/:postId', optionalProtect, getPostById);
router.put('/:postId', protect, updatePost);
router.delete('/:postId', protect, deletePost);
router.post('/:postId/react', protect, reactToPost);
router.post('/:postId/bookmark', protect, bookmarkPost);

module.exports = router;

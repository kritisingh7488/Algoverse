const express = require('express');
const router = express.Router();
const postRoutes = require('./postRoutes');
const {
    getCommunities,
    getMyCommunities,
    getTrendingCommunities,
    getCommunityByIdOrSlug,
    createCommunity,
    joinCommunity,
    leaveCommunity,
    updateCommunity,
    deleteCommunity
} = require('../controllers/communityController');
const { protect, optionalProtect } = require('../middleware/auth');

// Public listing with optional user context for isJoined
router.get('/', optionalProtect, getCommunities);
router.get('/trending', optionalProtect, getTrendingCommunities);

// Protected authenticated routes (Must precede /:idOrSlug to prevent route shadowing)
router.get('/my', protect, getMyCommunities);
router.post('/', protect, createCommunity);

// Mount nested post routes for community
router.use('/:communityId/posts', postRoutes);

// Specific Community routes
router.get('/:idOrSlug', optionalProtect, getCommunityByIdOrSlug);
router.post('/:id/join', protect, joinCommunity);
router.post('/:id/leave', protect, leaveCommunity);
router.put('/:id', protect, updateCommunity);
router.delete('/:id', protect, deleteCommunity);

module.exports = router;

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
const {
    submitJoinRequest,
    cancelJoinRequest,
    getMyJoinRequestStatus,
    getCommunityJoinRequests,
    approveJoinRequest,
    rejectJoinRequest,
    sendInvitation,
    getMyInvitations,
    acceptInvitation,
    declineInvitation
} = require('../controllers/communityRequestController');
const { protect, optionalProtect } = require('../middleware/auth');

// Public listing with optional user context for isJoined
router.get('/', optionalProtect, getCommunities);
router.get('/trending', optionalProtect, getTrendingCommunities);

// Protected authenticated routes (Must precede /:idOrSlug to prevent route shadowing)
router.get('/my', protect, getMyCommunities);
router.get('/my/invitations', protect, getMyInvitations);
router.post('/invitations/:invitationId/accept', protect, acceptInvitation);
router.post('/invitations/:invitationId/decline', protect, declineInvitation);
router.post('/', protect, createCommunity);

// Mount nested post routes for community
router.use('/:communityId/posts', postRoutes);

// Join Requests & Invitations for a specific community
router.post('/:id/join-request', protect, submitJoinRequest);
router.delete('/:id/join-request', protect, cancelJoinRequest);
router.get('/:id/join-request/status', protect, getMyJoinRequestStatus);
router.get('/:id/join-requests', protect, getCommunityJoinRequests);
router.post('/:id/join-requests/:requestId/approve', protect, approveJoinRequest);
router.post('/:id/join-requests/:requestId/reject', protect, rejectJoinRequest);
router.post('/:id/invitations', protect, sendInvitation);

// Specific Community routes
router.get('/:idOrSlug', optionalProtect, getCommunityByIdOrSlug);
router.post('/:id/join', protect, joinCommunity);
router.post('/:id/leave', protect, leaveCommunity);
router.put('/:id', protect, updateCommunity);
router.delete('/:id', protect, deleteCommunity);

module.exports = router;

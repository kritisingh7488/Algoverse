const express = require('express');
const router = express.Router();
const {
    getGlobalMessages,
    getCommunityMessages,
    sendGlobalMessage,
    sendCommunityMessage
} = require('../controllers/chatController');
const { protect, optionalProtect } = require('../middleware/auth');

// Global chat routes
router.get('/global/:channel/messages', optionalProtect, getGlobalMessages);
router.post('/global/:channel/messages', protect, sendGlobalMessage);

// Community chat routes
router.get('/community/:communityId/messages', optionalProtect, getCommunityMessages);
router.post('/community/:communityId/messages', protect, sendCommunityMessage);

module.exports = router;

const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getPostComments,
    createComment,
    updateComment,
    deleteComment,
    likeComment
} = require('../controllers/commentController');
const { protect, optionalProtect } = require('../middleware/auth');

// Post-nested comment routes (e.g. /api/v1/posts/:postId/comments)
router.get('/', optionalProtect, getPostComments);
router.post('/', protect, createComment);

// Direct comment actions (e.g. /api/v1/comments/:commentId)
router.put('/:commentId', protect, updateComment);
router.delete('/:commentId', protect, deleteComment);
router.post('/:commentId/like', protect, likeComment);

module.exports = router;

const mongoose = require('mongoose');
const Message = require('../models/Message');
const Community = require('../models/Community');

/**
 * @route   GET /api/v1/chat/global/:channel/messages
 * @desc    Fetch latest messages for a global channel
 * @access  Public
 */
exports.getGlobalMessages = async (req, res) => {
    try {
        const { channel = 'general' } = req.params;
        const { limit = 50, before } = req.query;

        const query = { roomType: 'global', channel };
        if (before) {
            query.createdAt = { $lt: new Date(before) };
        }

        const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));

        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .populate('sender', 'fullName username avatar role xp');

        // Return in chronological order (oldest first for chat timeline)
        return res.status(200).json({
            success: true,
            count: messages.length,
            data: messages.reverse()
        });
    } catch (error) {
        console.error('Error fetching global messages:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error retrieving messages',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/v1/chat/community/:communityId/messages
 * @desc    Fetch messages for a community room with privacy checks
 * @access  Public (or Member for private communities)
 */
exports.getCommunityMessages = async (req, res) => {
    try {
        const { communityId } = req.params;
        const { limit = 50, before } = req.query;
        const currentUserId = req.user ? req.user._id : null;

        const isObjectId = mongoose.Types.ObjectId.isValid(communityId);
        const queryComm = isObjectId ? { $or: [{ _id: communityId }, { slug: communityId }] } : { slug: communityId };
        const community = await Community.findOne(queryComm);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

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

        const query = { roomType: 'community', community: community._id };
        if (before) {
            query.createdAt = { $lt: new Date(before) };
        }

        const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));

        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .populate('sender', 'fullName username avatar role xp');

        return res.status(200).json({
            success: true,
            count: messages.length,
            data: messages.reverse()
        });
    } catch (error) {
        console.error('Error fetching community messages:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error retrieving messages',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/v1/chat/global/:channel/messages
 * @desc    Post a message to global channel via REST
 * @access  Private
 */
exports.sendGlobalMessage = async (req, res) => {
    try {
        const { channel = 'general' } = req.params;
        const { content, codeSnippet } = req.body;
        const userId = req.user._id;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Message content cannot be empty'
            });
        }

        const message = await Message.create({
            sender: userId,
            content: content.trim(),
            roomType: 'global',
            channel,
            codeSnippet: codeSnippet || { language: '', code: '' }
        });

        const populated = await Message.findById(message._id)
            .populate('sender', 'fullName username avatar role xp');

        return res.status(201).json({
            success: true,
            data: populated
        });
    } catch (error) {
        console.error('Error posting global message:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error posting message',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/v1/chat/community/:communityId/messages
 * @desc    Post a message to community room via REST
 * @access  Private
 */
exports.sendCommunityMessage = async (req, res) => {
    try {
        const { communityId } = req.params;
        const { content, codeSnippet } = req.body;
        const userId = req.user._id;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Message content cannot be empty'
            });
        }

        const isObjectId = mongoose.Types.ObjectId.isValid(communityId);
        const queryComm = isObjectId ? { $or: [{ _id: communityId }, { slug: communityId }] } : { slug: communityId };
        const community = await Community.findOne(queryComm);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        if (community.isPrivate) {
            const isMember = community.members.some(m => m.toString() === userId.toString());
            const isCreator = community.creator.toString() === userId.toString();
            const isAdmin = req.user.role === 'admin';

            if (!isMember && !isCreator && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'You must be a member to chat in this private community'
                });
            }
        }

        const message = await Message.create({
            sender: userId,
            content: content.trim(),
            roomType: 'community',
            community: community._id,
            codeSnippet: codeSnippet || { language: '', code: '' }
        });

        const populated = await Message.findById(message._id)
            .populate('sender', 'fullName username avatar role xp');

        return res.status(201).json({
            success: true,
            data: populated
        });
    } catch (error) {
        console.error('Error posting community message:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error posting message',
            error: error.message
        });
    }
};

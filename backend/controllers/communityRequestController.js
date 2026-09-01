const mongoose = require('mongoose');
const Community = require('../models/Community');
const User = require('../models/User');
const CommunityRequest = require('../models/CommunityRequest');

/**
 * Helper to resolve community by id or slug
 */
const findCommunityByIdOrSlug = async (idOrSlug) => {
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    const query = isObjectId 
        ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] } 
        : { slug: idOrSlug };
    return Community.findOne(query);
};

/**
 * @route   POST /api/v1/communities/:id/join-request
 * @desc    Submit a join request for a private community
 * @access  Private
 */
exports.submitJoinRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { message = '' } = req.body;
        const userId = req.user._id;

        const community = await findCommunityByIdOrSlug(id);
        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        if (!community.isPrivate) {
            return res.status(400).json({
                success: false,
                message: 'This community is public. You can join directly without requesting access.'
            });
        }

        // Check if user is already a member
        const isMember = community.members.some(m => m.toString() === userId.toString());
        if (isMember) {
            return res.status(400).json({
                success: false,
                message: 'You are already a member of this community.'
            });
        }

        // Check if pending request already exists
        const existingPending = await CommunityRequest.findOne({
            community: community._id,
            user: userId,
            type: 'join_request',
            status: 'pending'
        });

        if (existingPending) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending join request for this community.'
            });
        }

        const requestDoc = await CommunityRequest.create({
            community: community._id,
            user: userId,
            type: 'join_request',
            status: 'pending',
            message: (message || '').trim().slice(0, 300)
        });

        const populated = await CommunityRequest.findById(requestDoc._id)
            .populate('user', 'fullName username avatar xp role')
            .populate('community', 'name slug icon isPrivate');

        return res.status(201).json({
            success: true,
            message: 'Join request submitted successfully. The community founder will review your request.',
            data: populated
        });
    } catch (error) {
        console.error('Error submitting join request:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error submitting join request',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/v1/communities/:id/join-request
 * @desc    Cancel own pending join request
 * @access  Private
 */
exports.cancelJoinRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const community = await findCommunityByIdOrSlug(id);
        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        const pendingRequest = await CommunityRequest.findOne({
            community: community._id,
            user: userId,
            type: 'join_request',
            status: 'pending'
        });

        if (!pendingRequest) {
            return res.status(404).json({
                success: false,
                message: 'No pending join request found to cancel'
            });
        }

        pendingRequest.status = 'cancelled';
        await pendingRequest.save();

        return res.status(200).json({
            success: true,
            message: 'Join request cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling join request:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error cancelling join request',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/v1/communities/:id/join-request/status
 * @desc    Get current user's join request status for this community
 * @access  Private
 */
exports.getMyJoinRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const community = await findCommunityByIdOrSlug(id);
        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        const request = await CommunityRequest.findOne({
            community: community._id,
            user: userId,
            type: 'join_request',
            status: { $in: ['pending', 'approved', 'rejected'] }
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            status: request ? request.status : 'none',
            data: request || null
        });
    } catch (error) {
        console.error('Error fetching join request status:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error fetching join request status',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/v1/communities/:id/join-requests
 * @desc    Get all pending join requests for a community
 * @access  Private (Creator or Admin only)
 */
exports.getCommunityJoinRequests = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const community = await findCommunityByIdOrSlug(id);
        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        // Authorize: creator or admin only
        const isCreator = community.creator.toString() === userId.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isCreator && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Only the community creator can review join requests'
            });
        }

        const requests = await CommunityRequest.find({
            community: community._id,
            type: 'join_request',
            status: 'pending'
        })
        .populate('user', 'fullName username avatar xp role createdAt')
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        console.error('Error fetching community join requests:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error fetching join requests',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/v1/communities/:id/join-requests/:requestId/approve
 * @desc    Approve a join request & add applicant to community members
 * @access  Private (Creator or Admin only)
 */
exports.approveJoinRequest = async (req, res) => {
    try {
        const { id, requestId } = req.params;
        const userId = req.user._id;

        const community = await findCommunityByIdOrSlug(id);
        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        const isCreator = community.creator.toString() === userId.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isCreator && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Only the community creator can approve join requests'
            });
        }

        const requestDoc = await CommunityRequest.findOne({
            _id: requestId,
            community: community._id,
            type: 'join_request',
            status: 'pending'
        });

        if (!requestDoc) {
            return res.status(404).json({
                success: false,
                message: 'Pending join request not found'
            });
        }

        // Atomically add user to community members
        await Community.findByIdAndUpdate(community._id, {
            $addToSet: { members: requestDoc.user }
        });

        // Update community members count
        const updatedCommunity = await Community.findById(community._id)
            .populate('creator', 'fullName username avatar xp role')
            .populate('members', 'fullName username avatar xp role');

        updatedCommunity.membersCount = updatedCommunity.members.length;
        await updatedCommunity.save();

        // Update request status
        requestDoc.status = 'approved';
        await requestDoc.save();

        const populatedRequest = await CommunityRequest.findById(requestDoc._id)
            .populate('user', 'fullName username avatar xp role');

        return res.status(200).json({
            success: true,
            message: `Approved ${populatedRequest.user?.fullName || 'user'}'s join request!`,
            data: {
                request: populatedRequest,
                membersCount: updatedCommunity.membersCount
            }
        });
    } catch (error) {
        console.error('Error approving join request:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error approving join request',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/v1/communities/:id/join-requests/:requestId/reject
 * @desc    Reject a join request
 * @access  Private (Creator or Admin only)
 */
exports.rejectJoinRequest = async (req, res) => {
    try {
        const { id, requestId } = req.params;
        const userId = req.user._id;

        const community = await findCommunityByIdOrSlug(id);
        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        const isCreator = community.creator.toString() === userId.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isCreator && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Only the community creator can reject join requests'
            });
        }

        const requestDoc = await CommunityRequest.findOne({
            _id: requestId,
            community: community._id,
            type: 'join_request',
            status: 'pending'
        });

        if (!requestDoc) {
            return res.status(404).json({
                success: false,
                message: 'Pending join request not found'
            });
        }

        requestDoc.status = 'rejected';
        await requestDoc.save();

        const populatedRequest = await CommunityRequest.findById(requestDoc._id)
            .populate('user', 'fullName username avatar xp role');

        return res.status(200).json({
            success: true,
            message: 'Join request rejected',
            data: populatedRequest
        });
    } catch (error) {
        console.error('Error rejecting join request:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error rejecting join request',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/v1/communities/:id/invitations
 * @desc    Invite a user to a private community
 * @access  Private (Creator or Admin only)
 */
exports.sendInvitation = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, userId: targetUserId, message = '' } = req.body;
        const senderId = req.user._id;

        const community = await findCommunityByIdOrSlug(id);
        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        const isCreator = community.creator.toString() === senderId.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isCreator && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Only the community creator can invite new members'
            });
        }

        // Find target user
        let targetUser = null;
        if (targetUserId) {
            targetUser = await User.findById(targetUserId);
        } else if (username && username.trim()) {
            targetUser = await User.findOne({ username: username.trim().toLowerCase() });
        }

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: `User '${username || targetUserId}' not found`
            });
        }

        // Check if target user is already a member
        const isMember = community.members.some(m => m.toString() === targetUser._id.toString());
        if (isMember) {
            return res.status(400).json({
                success: false,
                message: `${targetUser.username} is already a member of this community.`
            });
        }

        // Check for existing pending invitation
        const existingInvite = await CommunityRequest.findOne({
            community: community._id,
            user: targetUser._id,
            type: 'invitation',
            status: 'pending'
        });

        if (existingInvite) {
            return res.status(400).json({
                success: false,
                message: `An invitation has already been sent to ${targetUser.username}.`
            });
        }

        const inviteDoc = await CommunityRequest.create({
            community: community._id,
            user: targetUser._id,
            type: 'invitation',
            inviter: senderId,
            status: 'pending',
            message: (message || '').trim().slice(0, 300)
        });

        const populatedInvite = await CommunityRequest.findById(inviteDoc._id)
            .populate('user', 'fullName username avatar xp role')
            .populate('community', 'name slug icon isPrivate')
            .populate('inviter', 'fullName username avatar');

        return res.status(201).json({
            success: true,
            message: `Invitation sent to ${targetUser.fullName || targetUser.username}`,
            data: populatedInvite
        });
    } catch (error) {
        console.error('Error sending community invitation:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error sending invitation',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/v1/communities/my/invitations
 * @desc    Get all pending community invitations for current user
 * @access  Private
 */
exports.getMyInvitations = async (req, res) => {
    try {
        const userId = req.user._id;

        const invitations = await CommunityRequest.find({
            user: userId,
            type: 'invitation',
            status: 'pending'
        })
        .populate('community', 'name slug icon category description membersCount gradient accentColor')
        .populate('inviter', 'fullName username avatar xp role')
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: invitations.length,
            data: invitations
        });
    } catch (error) {
        console.error('Error fetching invitations:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error fetching invitations',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/v1/communities/invitations/:invitationId/accept
 * @desc    Accept a community invitation
 * @access  Private
 */
exports.acceptInvitation = async (req, res) => {
    try {
        const { invitationId } = req.params;
        const userId = req.user._id;

        const invite = await CommunityRequest.findOne({
            _id: invitationId,
            user: userId,
            type: 'invitation',
            status: 'pending'
        }).populate('community');

        if (!invite || !invite.community) {
            return res.status(404).json({
                success: false,
                message: 'Pending invitation not found'
            });
        }

        // Add user to community members
        await Community.findByIdAndUpdate(invite.community._id, {
            $addToSet: { members: userId }
        });

        // Update membersCount
        const updatedCommunity = await Community.findById(invite.community._id)
            .populate('creator', 'fullName username avatar xp role')
            .populate('members', 'fullName username avatar xp role');

        updatedCommunity.membersCount = updatedCommunity.members.length;
        await updatedCommunity.save();

        // Update invitation status
        invite.status = 'accepted';
        await invite.save();

        return res.status(200).json({
            success: true,
            message: `Joined ${invite.community.name}! Welcome to the guild.`,
            data: updatedCommunity
        });
    } catch (error) {
        console.error('Error accepting invitation:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error accepting invitation',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/v1/communities/invitations/:invitationId/decline
 * @desc    Decline a community invitation
 * @access  Private
 */
exports.declineInvitation = async (req, res) => {
    try {
        const { invitationId } = req.params;
        const userId = req.user._id;

        const invite = await CommunityRequest.findOne({
            _id: invitationId,
            user: userId,
            type: 'invitation',
            status: 'pending'
        });

        if (!invite) {
            return res.status(404).json({
                success: false,
                message: 'Pending invitation not found'
            });
        }

        invite.status = 'declined';
        await invite.save();

        return res.status(200).json({
            success: true,
            message: 'Invitation declined'
        });
    } catch (error) {
        console.error('Error declining invitation:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error declining invitation',
            error: error.message
        });
    }
};

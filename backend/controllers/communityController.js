const mongoose = require('mongoose');
const Community = require('../models/Community');
const User = require('../models/User');

/**
 * Format a community document for client response with membership status
 */
const formatCommunityResponse = (comm, currentUserId) => {
    const obj = comm.toObject ? comm.toObject() : { ...comm };
    
    // Check if current user is a member
    if (currentUserId && obj.members) {
        obj.isJoined = obj.members.some(m => {
            const memberId = m._id ? m._id.toString() : m.toString();
            return memberId === currentUserId.toString();
        });
    } else {
        obj.isJoined = false;
    }

    // Format membersPreview if members are populated
    if (obj.members && obj.members.length > 0 && typeof obj.members[0] === 'object') {
        obj.membersPreview = obj.members.slice(0, 10).map(m => ({
            id: m._id ? m._id.toString() : m.toString(),
            name: m.fullName || m.username || 'Learner',
            username: m.username || '',
            role: obj.creator && (obj.creator._id ? obj.creator._id.toString() : obj.creator.toString()) === (m._id ? m._id.toString() : m.toString())
                ? 'Founder & Moderator'
                : 'Member',
            avatar: m.avatar || '',
            xp: m.xp || 100
        }));
    }

    return obj;
};

/**
 * @route   GET /api/v1/communities
 * @desc    Get all public communities with search, category filtering & sorting
 * @access  Public (optional auth for isJoined status)
 */
exports.getCommunities = async (req, res) => {
    try {
        const { search, category, sort = 'trending', page = 1, limit = 50 } = req.query;
        const currentUserId = req.user ? req.user._id : null;

        const query = { isPrivate: false };

        // Category filter
        if (category && category !== 'All') {
            query.category = category;
        }

        // Search query
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [
                { name: searchRegex },
                { description: searchRegex },
                { tags: searchRegex },
                { category: searchRegex }
            ];
        }

        // Sorting options
        let sortOption = {};
        if (sort === 'trending') {
            sortOption = { isTrending: -1, trendingRank: 1, membersCount: -1, createdAt: -1 };
        } else if (sort === 'popular') {
            sortOption = { membersCount: -1, createdAt: -1 };
        } else if (sort === 'new') {
            sortOption = { createdAt: -1 };
        } else {
            sortOption = { createdAt: -1 };
        }

        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const take = parseInt(limit, 10);

        const [communities, total] = await Promise.all([
            Community.find(query)
                .sort(sortOption)
                .skip(skip)
                .limit(take)
                .populate('creator', 'fullName username avatar xp role')
                .populate('members', 'fullName username avatar xp role'),
            Community.countDocuments(query)
        ]);

        const formatted = communities.map(c => formatCommunityResponse(c, currentUserId));

        return res.status(200).json({
            success: true,
            count: formatted.length,
            total,
            page: parseInt(page, 10),
            pages: Math.ceil(total / take),
            data: formatted
        });
    } catch (error) {
        console.error('Error fetching communities:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while retrieving communities',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/v1/communities/my
 * @desc    Get communities joined or created by the authenticated user
 * @access  Private
 */
exports.getMyCommunities = async (req, res) => {
    try {
        const userId = req.user._id;

        const communities = await Community.find({
            $or: [
                { members: userId },
                { creator: userId }
            ]
        })
        .sort({ updatedAt: -1 })
        .populate('creator', 'fullName username avatar xp role')
        .populate('members', 'fullName username avatar xp role');

        const formatted = communities.map(c => formatCommunityResponse(c, userId));

        return res.status(200).json({
            success: true,
            count: formatted.length,
            data: formatted
        });
    } catch (error) {
        console.error('Error fetching my communities:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while retrieving your communities',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/v1/communities/trending
 * @desc    Get top trending communities
 * @access  Public
 */
exports.getTrendingCommunities = async (req, res) => {
    try {
        const currentUserId = req.user ? req.user._id : null;

        const trending = await Community.find({ isPrivate: false })
            .sort({ isTrending: -1, trendingRank: 1, membersCount: -1 })
            .limit(5)
            .populate('creator', 'fullName username avatar xp role')
            .populate('members', 'fullName username avatar xp role');

        const formatted = trending.map(c => formatCommunityResponse(c, currentUserId));

        return res.status(200).json({
            success: true,
            count: formatted.length,
            data: formatted
        });
    } catch (error) {
        console.error('Error fetching trending communities:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while retrieving trending communities',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/v1/communities/:idOrSlug
 * @desc    Get single community details by ID or Slug
 * @access  Public (or Private for private communities)
 */
exports.getCommunityByIdOrSlug = async (req, res) => {
    try {
        const { idOrSlug } = req.params;
        const currentUserId = req.user ? req.user._id : null;

        const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
        const query = isObjectId 
            ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] } 
            : { slug: idOrSlug };

        const community = await Community.findOne(query)
            .populate('creator', 'fullName username avatar xp role')
            .populate('members', 'fullName username avatar xp role');

        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        // Check private community access rules
        if (community.isPrivate) {
            const isMember = currentUserId && community.members.some(m => m._id.toString() === currentUserId.toString());
            const isCreator = currentUserId && community.creator && community.creator._id.toString() === currentUserId.toString();
            const isAdmin = req.user && req.user.role === 'admin';

            if (!isMember && !isCreator && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'This community is private. You must be an approved member to view details.'
                });
            }
        }

        const formatted = formatCommunityResponse(community, currentUserId);

        return res.status(200).json({
            success: true,
            data: formatted
        });
    } catch (error) {
        console.error('Error fetching community details:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while retrieving community details',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/v1/communities
 * @desc    Create a new community
 * @access  Private
 */
exports.createCommunity = async (req, res) => {
    try {
        const {
            name,
            description,
            category = 'DSA',
            icon = '⚡',
            gradient = 'from-primary/20 to-secondary/20',
            accentColor = '#FF8A80',
            isPrivate = false,
            tags = [],
            about = '',
            rules = []
        } = req.body;

        // Validation
        if (!name || name.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Community name must be at least 3 characters'
            });
        }

        if (name.trim().length > 40) {
            return res.status(400).json({
                success: false,
                message: 'Community name cannot exceed 40 characters'
            });
        }

        if (!description || description.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Description must be at least 10 characters'
            });
        }

        if (description.trim().length > 250) {
            return res.status(400).json({
                success: false,
                message: 'Description cannot exceed 250 characters'
            });
        }

        // Generate unique slug
        const slug = await Community.generateSlug(name.trim());

        const newCommunity = new Community({
            name: name.trim(),
            slug,
            description: description.trim(),
            category,
            icon,
            gradient,
            accentColor,
            isPrivate: !!isPrivate,
            isTrending: false,
            isVerified: false,
            tags: Array.isArray(tags) ? tags : [category],
            about: about.trim() || description.trim(),
            rules: Array.isArray(rules) && rules.length > 0 ? rules : [
                'Be welcoming and respectful to all learners.',
                'Format all code snippets properly with comments.',
                'Explain intuition and time/space complexity when sharing solutions.'
            ],
            creator: req.user._id,
            members: [req.user._id],
            membersCount: 1
        });

        await newCommunity.save();

        const populated = await Community.findById(newCommunity._id)
            .populate('creator', 'fullName username avatar xp role')
            .populate('members', 'fullName username avatar xp role');

        const formatted = formatCommunityResponse(populated, req.user._id);

        return res.status(201).json({
            success: true,
            message: 'Community created successfully',
            data: formatted
        });
    } catch (error) {
        console.error('Error creating community:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while creating community',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/v1/communities/:id/join
 * @desc    Join a community
 * @access  Private
 */
exports.joinCommunity = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };

        const community = await Community.findOne(query);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        // Check if already a member
        const alreadyMember = community.members.some(m => m.toString() === userId.toString());
        if (alreadyMember) {
            return res.status(200).json({
                success: true,
                message: 'Already a member of this community',
                data: formatCommunityResponse(community, userId)
            });
        }

        // Add member
        community.members.push(userId);
        community.membersCount = community.members.length;
        await community.save();

        const updated = await Community.findById(community._id)
            .populate('creator', 'fullName username avatar xp role')
            .populate('members', 'fullName username avatar xp role');

        return res.status(200).json({
            success: true,
            message: 'Successfully joined community',
            data: formatCommunityResponse(updated, userId)
        });
    } catch (error) {
        console.error('Error joining community:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while joining community',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/v1/communities/:id/leave
 * @desc    Leave a community
 * @access  Private
 */
exports.leaveCommunity = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };

        const community = await Community.findOne(query);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        // Prevent creator from leaving without deleting or transferring
        if (community.creator.toString() === userId.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Community creator cannot leave their own community. You may delete the community instead.'
            });
        }

        // Remove member
        community.members = community.members.filter(m => m.toString() !== userId.toString());
        community.membersCount = community.members.length;
        await community.save();

        const updated = await Community.findById(community._id)
            .populate('creator', 'fullName username avatar xp role')
            .populate('members', 'fullName username avatar xp role');

        return res.status(200).json({
            success: true,
            message: 'Successfully left community',
            data: formatCommunityResponse(updated, userId)
        });
    } catch (error) {
        console.error('Error leaving community:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while leaving community',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/v1/communities/:id
 * @desc    Update community details
 * @access  Private (Owner/Admin only)
 */
exports.updateCommunity = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const isAdmin = req.user.role === 'admin';

        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };

        const community = await Community.findOne(query);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        // Authorization check
        if (community.creator.toString() !== userId.toString() && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to edit this community'
            });
        }

        const { name, description, category, icon, isPrivate, tags, about, rules } = req.body;

        if (name) community.name = name.trim();
        if (description) community.description = description.trim();
        if (category) community.category = category;
        if (icon) community.icon = icon;
        if (typeof isPrivate === 'boolean') community.isPrivate = isPrivate;
        if (Array.isArray(tags)) community.tags = tags;
        if (about) community.about = about.trim();
        if (Array.isArray(rules)) community.rules = rules;

        await community.save();

        const updated = await Community.findById(community._id)
            .populate('creator', 'fullName username avatar xp role')
            .populate('members', 'fullName username avatar xp role');

        return res.status(200).json({
            success: true,
            message: 'Community updated successfully',
            data: formatCommunityResponse(updated, userId)
        });
    } catch (error) {
        console.error('Error updating community:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while updating community',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/v1/communities/:id
 * @desc    Delete a community
 * @access  Private (Owner/Admin only)
 */
exports.deleteCommunity = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const isAdmin = req.user.role === 'admin';

        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };

        const community = await Community.findOne(query);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        // Authorization check
        if (community.creator.toString() !== userId.toString() && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this community'
            });
        }

        await Community.findByIdAndDelete(community._id);

        return res.status(200).json({
            success: true,
            message: 'Community deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting community:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while deleting community',
            error: error.message
        });
    }
};

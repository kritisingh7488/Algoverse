const mongoose = require('mongoose');

const communityRequestSchema = new mongoose.Schema({
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['join_request', 'invitation'],
        default: 'join_request',
        required: true
    },
    inviter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled', 'accepted', 'declined'],
        default: 'pending',
        index: true
    },
    message: {
        type: String,
        trim: true,
        maxlength: 300,
        default: ''
    }
}, {
    timestamps: true
});

communityRequestSchema.index({ community: 1, user: 1, type: 1, status: 1 });

const CommunityRequest = mongoose.model('CommunityRequest', communityRequestSchema);
module.exports = CommunityRequest;

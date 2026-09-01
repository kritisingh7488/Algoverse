const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Message must have an author']
    },
    content: {
        type: String,
        required: [true, 'Message content cannot be empty'],
        trim: true,
        maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    roomType: {
        type: String,
        enum: ['global', 'community'],
        default: 'global'
    },
    channel: {
        type: String,
        trim: true,
        default: 'general'
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
        default: null
    },
    codeSnippet: {
        language: { type: String, default: '' },
        code: { type: String, default: '' }
    }
}, {
    timestamps: true
});

messageSchema.index({ roomType: 1, channel: 1, createdAt: -1 });
messageSchema.index({ roomType: 1, community: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);

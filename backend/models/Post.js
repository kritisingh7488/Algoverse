const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Post title is required'],
        trim: true,
        minlength: [5, 'Post title must be at least 5 characters'],
        maxlength: [150, 'Post title cannot exceed 150 characters']
    },
    content: {
        type: String,
        required: [true, 'Post content is required'],
        minlength: [10, 'Post content must be at least 10 characters'],
        maxlength: [10000, 'Post content cannot exceed 10,000 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
        required: [true, 'Community is required']
    },
    postType: {
        type: String,
        enum: ['Discussion', 'Question', 'Help', 'Code', 'Resource', 'Announcement'],
        default: 'Discussion'
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    reactions: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        type: {
            type: String,
            enum: ['like', 'love', 'insightful', 'helpful', 'celebrate'],
            default: 'like'
        }
    }],
    reactionsCount: {
        type: Number,
        default: 0
    },
    reactionsSummary: {
        like: { type: Number, default: 0 },
        love: { type: Number, default: 0 },
        insightful: { type: Number, default: 0 },
        helpful: { type: Number, default: 0 },
        celebrate: { type: Number, default: 0 }
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isEdited: {
        type: Boolean,
        default: false
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    isSolved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for fast querying
postSchema.index({ community: 1, createdAt: -1 });
postSchema.index({ community: 1, postType: 1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

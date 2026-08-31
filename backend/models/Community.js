const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Community name is required'],
        trim: true,
        minlength: [3, 'Community name must be at least 3 characters'],
        maxlength: [40, 'Community name cannot exceed 40 characters']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters'],
        maxlength: [250, 'Description cannot exceed 250 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'DSA',
            'Competitive Programming',
            'C++',
            'Java',
            'Python',
            'Web Development',
            'Algorithms',
            'Interview Preparation',
            'Beginners',
            'Other'
        ],
        default: 'DSA'
    },
    icon: {
        type: String,
        default: '⚡'
    },
    gradient: {
        type: String,
        default: 'from-primary/20 to-secondary/20'
    },
    accentColor: {
        type: String,
        default: '#FF8A80'
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    isTrending: {
        type: Boolean,
        default: false
    },
    trendingRank: {
        type: Number,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    tags: {
        type: [String],
        default: []
    },
    about: {
        type: String,
        default: ''
    },
    rules: {
        type: [String],
        default: [
            'Be welcoming and respectful to all learners.',
            'Format all code snippets properly with comments.',
            'Explain intuition and time/space complexity when sharing solutions.'
        ]
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    membersCount: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

// Create index for search and category filtering
communitySchema.index({ name: 'text', description: 'text', tags: 'text' });
communitySchema.index({ category: 1, isPrivate: 1, isTrending: 1 });

// Helper to generate a slug from name
communitySchema.statics.generateSlug = async function(name) {
    let baseSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    if (!baseSlug) baseSlug = 'guild';

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await this.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
    }
    return uniqueSlug;
};

// Synchronize membersCount before save
communitySchema.pre('save', function() {
    if (this.members) {
        this.membersCount = this.members.length;
    }
});

const Community = mongoose.model('Community', communitySchema);
module.exports = Community;

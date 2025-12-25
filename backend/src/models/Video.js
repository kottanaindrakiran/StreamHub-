const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    filename: {
        type: String,
        required: true
    },
    filepath: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sensitivityStatus: {
        type: String,
        enum: ['pending', 'processing', 'safe', 'flagged'],
        default: 'pending'
    },
    processingProgress: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number, // In seconds
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    isOptimized: {
        type: Boolean,
        default: false
    },
    availableResolutions: {
        type: [String],
        default: ['original']
    },
    visibility: {
        type: String,
        enum: ['private', 'public', 'restricted', 'admin-only'],
        default: 'public' // Default to public (Tenant-wide) as per usual flow, or private if safer. User asked for choice.
    },
    allowedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Video', videoSchema);

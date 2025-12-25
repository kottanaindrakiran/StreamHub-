const Video = require('../models/Video');
const fs = require('fs');
const path = require('path');

// Simulated AI Processing Service
const processVideo = async (video, io) => {
    try {
        video.sensitivityStatus = 'processing';
        await video.save();

        // Notify start
        io.emit('videoStatusUpdate', { videoId: video._id, status: 'processing', progress: 0 });

        // Simulate processing steps (0% -> 100%)
        let progress = 0;
        const interval = setInterval(async () => {
            progress += 10;
            video.processingProgress = progress;

            if (progress >= 100) {
                clearInterval(interval);

                // Randomly assign safe or flagged
                const isUnsafe = Math.random() > 0.8; // 20% chance of being flagged
                video.sensitivityStatus = isUnsafe ? 'flagged' : 'safe';
                video.processingProgress = 100;
                await video.save();

                io.emit('videoStatusUpdate', {
                    videoId: video._id,
                    status: video.sensitivityStatus,
                    progress: 100
                });
            } else {
                io.emit('videoStatusUpdate', {
                    videoId: video._id,
                    status: 'processing',
                    progress: progress
                });
            }
        }, 1000); // 1. Sensitivity Analysis

        // 2. Simulated Optimization (Transcoding)
        // In a real app with FFmpeg, this would be a separate queue
        setTimeout(async () => {
            try {
                const v = await Video.findById(video._id);
                if (v) {
                    v.isOptimized = true;
                    v.availableResolutions = ['original', '720p', '480p'];
                    await v.save();
                    console.log(`Video ${v._id} optimized for streaming`);
                }
            } catch (err) {
                console.error('Optimization simulation failed', err);
            }
        }, 15000); // Run 15s after upload start (mostly overlapping or after processing)

    } catch (error) {
        console.error('Processing error:', error);
    }
};

// @desc    Upload video
// @route   POST /api/videos
// @access  Private (Editor/Admin)
const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        console.log('Upload request body:', req.body);
        console.log('Upload request file:', req.file);

        let parsedAllowedUsers = [];
        if (req.body.allowedUsers) {
            try {
                parsedAllowedUsers = JSON.parse(req.body.allowedUsers);
            } catch (e) {
                console.error('Error parsing allowedUsers:', e);
                parsedAllowedUsers = []; // Fallback
            }
        }

        const video = await Video.create({
            title: req.body.title || req.file.originalname,
            description: req.body.description || '',
            filename: req.file.filename,
            filepath: req.file.path,
            originalName: req.file.originalname,
            size: req.file.size,
            mimeType: req.file.mimetype,
            uploader: req.user._id,
            visibility: req.body.visibility || 'public',
            allowedUsers: parsedAllowedUsers
        });

        // Trigger Async Processing
        processVideo(video, req.io);

        // Notify all clients about new upload
        req.io.emit('newVideoUploaded', {
            uploader: req.user.name,
            title: video.title,
            id: video._id
        });

        res.status(201).json(video);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during upload' });
    }
};

// @desc    Get all videos
// @route   GET /api/videos
// @access  Private
const getVideos = async (req, res) => {
    try {
        let query = {};

        // Visibility Logic
        if (req.user.role === 'admin') {
            // Admins see everything
            query = {};
        } else {
            // Non-admins see:
            // 1. Their own videos
            // 2. Public (Tenant-wide) videos
            // 3. Restricted videos where they are in allowedUsers
            query = {
                $or: [
                    { uploader: req.user._id }, // My videos
                    { visibility: 'public' },   // Tenant-wide
                    {
                        visibility: 'restricted',
                        allowedUsers: req.user._id
                    }
                ]
            };
        }

        const videos = await Video.find(query).populate('uploader', 'name').sort('-createdAt');
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get video by ID
// @route   GET /api/videos/:id
// @access  Private
const getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id).populate('uploader', 'name');

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Access Check
        const isAdmin = req.user.role === 'admin';
        const isOwner = video.uploader._id.toString() === req.user._id.toString();
        const isPublic = video.visibility === 'public';
        const isAllowed = video.visibility === 'restricted' && video.allowedUsers.includes(req.user._id);

        if (!isAdmin && !isOwner && !isPublic && !isAllowed) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(video);
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Video not found' });
    }
};

// @desc    Stream video content
// @route   GET /api/videos/:id/stream
// @access  Private
const streamVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const filePath = video.filepath;

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Video file missing' });
        }

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1;

            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(filePath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs.createReadStream(filePath).pipe(res);
        }

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

// @desc    Download video file
// @route   GET /api/videos/:id/download
// @access  Private
const downloadVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const filePath = video.filepath; // Ensure this matches where you are storing files
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Video file missing' });
        }

        res.download(filePath, video.originalName || video.filename);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update video details
// @route   PUT /api/videos/:id
// @access  Private
const updateVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Access Check (Only Owner or Admin can update)
        if (req.user.role !== 'admin' && video.uploader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this video' });
        }

        // Update fields
        video.title = req.body.title || video.title;
        video.description = req.body.description || video.description;
        video.visibility = req.body.visibility || video.visibility;

        if (req.body.allowedUsers) {
            try {
                video.allowedUsers = JSON.parse(req.body.allowedUsers);
            } catch (e) {
                // If it's already an array (from frontend JSON) or invalid, handle gracefully
                if (Array.isArray(req.body.allowedUsers)) {
                    video.allowedUsers = req.body.allowedUsers;
                }
            }
        }

        const updatedVideo = await video.save();
        res.json(updatedVideo);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private
const deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Access Check (Only Owner or Admin can delete)
        if (req.user.role !== 'admin' && video.uploader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this video' });
        }

        // Delete file from filesystem
        if (fs.existsSync(video.filepath)) {
            fs.unlinkSync(video.filepath);
        }

        await video.deleteOne();
        res.json({ message: 'Video removed' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    uploadVideo,
    getVideos,
    getVideoById,
    streamVideo,
    downloadVideo,
    deleteVideo,
    updateVideo
};

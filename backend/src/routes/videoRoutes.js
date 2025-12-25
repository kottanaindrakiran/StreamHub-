const express = require('express');
const router = express.Router();
const { uploadVideo, getVideos, getVideoById, streamVideo, deleteVideo, downloadVideo, updateVideo } = require('../controllers/videoController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(protect, getVideos)
    .post(protect, authorize('editor', 'admin'), upload.single('video'), uploadVideo);

router.route('/:id')
    .get(protect, getVideoById)
    .put(protect, authorize('editor', 'admin'), updateVideo)
    .delete(protect, deleteVideo);

router.get('/:id/stream', protect, streamVideo);
router.get('/:id/download', protect, downloadVideo);

module.exports = router;

const mongoose = require('mongoose');
const User = require('./src/models/User');
const Video = require('./src/models/Video');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Clear existing data
        await User.deleteMany({});
        await Video.deleteMany({});
        console.log('Cleared Users and Videos');

        // Create Admin
        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@streamline.com',
            password: 'password123',
            role: 'admin'
        });
        console.log('Created Admin: admin@streamline.com / password123');

        // Create Video pointing to EXISTING file
        const validFile = 'video-1766642519564-826550401.mp4';
        // Use path relative to key execution context or verify absolute
        const absPath = path.join(__dirname, 'uploads', validFile);

        const video = await Video.create({
            title: 'Debugging Test Video',
            description: 'Manual entry for debugging playback',
            filename: validFile,
            filepath: absPath,
            originalName: 'debug-file.mp4',
            size: 2576984,
            mimeType: 'video/mp4',
            uploader: admin._id,
            visibility: 'public',
            sensitivityStatus: 'safe',
            processingProgress: 100,
            status: 'Completed'
        });
        console.log('Created Diagnostic Video:', video._id);
        console.log('Filepath set to:', absPath);

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

resetAdmin();

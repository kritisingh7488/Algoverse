const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: './.env' });

async function verifyConfig() {
    console.log('Testing Configuration...');

    // 1. Verify required environment variables
    const requiredEnv = [
        'MONGODB_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 
        'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 
        'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'
    ];
    let missing = [];
    for (const env of requiredEnv) {
        if (!process.env[env]) missing.push(env);
    }
    
    if (missing.length > 0) {
        console.error('MISSING ENV VARIABLES:', missing.join(', '));
        process.exit(1);
    } else {
        console.log('✅ All required environment variables present.');
    }

    // 2. Test MongoDB
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connection successful.');
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    }

    // 3. Test Cloudinary
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        const result = await cloudinary.api.ping();
        if (result.status === 'ok') {
            console.log('✅ Cloudinary configuration valid.');
        } else {
            console.error('❌ Cloudinary returned non-ok status.');
            process.exit(1);
        }
    } catch (err) {
        console.error('❌ Cloudinary configuration failed:', err.message);
        process.exit(1);
    }
    
    // 4. Test Google OAuth (format check)
    if (process.env.GOOGLE_CLIENT_ID.endsWith('.apps.googleusercontent.com') && process.env.GOOGLE_CLIENT_SECRET.length > 20) {
        console.log('✅ Google OAuth credentials format looks valid.');
    } else {
        console.warn('⚠️ Google OAuth credentials format might be invalid.');
    }

    console.log('\nAll configurations verified successfully!');
    process.exit(0);
}

verifyConfig();

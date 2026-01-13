const cloudinary = require('cloudinary').v2;

// 🔍 টেস্ট লগ (শুধু ডেভেলপমেন্টে)
console.log("Cloudinary config loading...");
console.log("CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API_KEY present:", !!process.env.CLOUDINARY_API_KEY);
console.log("API_SECRET present:", !!process.env.CLOUDINARY_API_SECRET);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {  
        return {
            folder: 'profile_pictures',
            allowed_formats: ['jpg', 'jpeg', 'png'],
            transformation: [{ width: 300, height: 300, crop: 'fill' }],
            upload_preset: 'profile_upload', 
            resource_type: 'auto',
            public_id: `profile_${Date.now()}_${file.originalname.split('.')[0]}`
        };
    }
});

const upload = multer({ storage });

module.exports = upload;
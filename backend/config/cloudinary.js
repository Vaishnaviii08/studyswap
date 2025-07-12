const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'studyswap_uploads',
    resource_type: 'raw', // ✅ MUST be raw for .pdf/.docx
    use_filename: true,
    unique_filename: false,
    format: file.originalname.split('.').pop(),
    };
  },
});

module.exports = {cloudinary, storage};
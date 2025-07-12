const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure 'uploads/' folder exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ 
  storage, 
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB
});

module.exports = upload;

const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadResource, getResources, downloadResource, getPreviewUrl } = require("../controllers/resourceController");
const auth = require("../middleware/auth");
const { body } = require('express-validator');

// Test route to verify the router is working
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Resources route is working!" });
});

// Upload route with proper error handling
router.post("/upload", 
    // Authentication middleware
    auth,
    // File upload middleware with error handling
    (req, res, next) => {
      upload.single("file")(req, res, (err) => {
        if (err) {
          console.error("Multer error:", err);
          return res.status(400).json({ 
            success: false, 
            error: "File upload error", 
            details: err.message 
          });
        }
        console.log("File accepted by Multer"); //d
        next();
      });
    },
    // Validation middleware
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('subject').notEmpty().withMessage('Subject is required'),
        body('semester').notEmpty().withMessage('Semester is required')
    ],
    // Controller function
    uploadResource
);

//Router to get user information
router.get("/", getResources);

// Get preview URL for a resource
router.get("/:id/preview", getPreviewUrl);

//Routes to track downloads and credits
router.post("/:id/download", auth, downloadResource);

module.exports = router;
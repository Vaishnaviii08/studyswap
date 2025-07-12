const Resource = require("../models/Resource");
const User = require("../models/User");
const Download = require("../models/Download");
const { validationResult } = require("express-validator");
const cloudinary = require("../config/cloudinary").cloudinary;
const path = require("path");

//To upload files
const uploadResource = async (req, res) => {
  try {
    //Checks for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Send the array of error messages back
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user exists
    const user = await User.findById(req.userId);
    if (!user) {
      console.log("User not found:", req.userId);
      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({
        success: false,
        error: "No file uploaded.",
      });
    }

    console.log("File Info:", req.file);
    console.log("Body:", req.body);
    console.log("Validation Errors:", validationResult(req).array());

    const { title, description, subject, semester, tags } = req.body;

    const fs = require("fs");

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "studyswap_uploads",
      use_filename: true,
      unique_filename: false,
      access_mode: "public",
    });

    // Delete local file after upload
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });

    const fileType = req.file.mimetype;

    const newResource = new Resource({
      uploaderUserId: req.userId,
      title,
      description,
      subject,
      semester,
      tags: tags ? tags.split(",") : [],
      fileURL: fileUrl,
      fileType,
    });

    await newResource.save();

    // Update user's upload count and credits
    await User.findByIdAndUpdate(req.userId, {
      $inc: { uploadsCount: 1, downloadCredits: 5 }, // e.g., 5 credits per upload
    });

    return res.status(201).json({
      success: true,
      message: "Resource uploaded successfully",
      resource: newResource,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error during file upload",
      details: error.message,
    });
  }
};

//To get resources
const getResources = async (req, res) => {
  try {
    // Extracts query parameters from the request URL (/resources?search=dsa&subject=Math)
    const {
      search = "",
      subject,
      semester,
      fileType,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter object
    let filter = {};

    // Adds search condition; $regex allows partial and case-insensitive matching; $or allows it to match any of the fields
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    //Adds filters
    if (subject) filter.subject = subject;
    if (semester) filter.semester = Number(semester);
    if (fileType) filter.fileType = fileType;

    //alculates how many results to skip, this is for pagination
    const skip = (page - 1) * limit;

    //  Fetch data from DB
    const resources = await Resource.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("uploaderUserId", "username");

    // Get total count for pagination
    const total = await Resource.countDocuments(filter);

    return res.status(200).json({
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      resources,
    });
  } catch (err) {
    console.error("Error in getResources:", err);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
};

const downloadResource = async (req, res) => {
  try {
    console.log("Download route called for resource:", req.params.id); //d

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      console.log("Resource not found");
      return res.status(404).json({ message: "Resource not found" });
    }

    // Get user information
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has enough credits (skip if they're the uploader)
    const isUploader = resource.uploaderUserId.toString() === req.userId;
    const requiredCredits = 1; // You can make this configurable

    if (!isUploader && user.downloadCredits < requiredCredits) {
      return res.status(403).json({
        success: false,
        message: "Insufficient download credits",
        currentCredits: user.downloadCredits,
        requiredCredits: requiredCredits,
      });
    }

    // For raw files, we need to use the original URL with attachment parameter
    const fileUrl = resource.fileURL;

    // Generate download URL by adding attachment flag to the original URL
    const downloadUrl = generateDownloadUrl(fileUrl, resource.title);

    console.log("📦 Generated download URL:", downloadUrl); //d

    // Update download count and user credits
    if (!isUploader) {
      // Deduct credits from user
      await User.findByIdAndUpdate(req.userId, {
        $inc: { downloadCredits: -requiredCredits },
      });

      // Increment download count for resource
      await Resource.findByIdAndUpdate(req.params.id, {
        $inc: { downloadsCount: 1 },
      });

      // Track the download
      const downloadRecord = new Download({
        userId: req.userId,
        resourceId: req.params.id,
        downloadedAt: new Date(),
      });
      await downloadRecord.save();
    }

    // Return the download URL instead of streaming the file
    return res.status(200).json({
      success: true,
      message: "Download URL generated successfully",
      downloadUrl: downloadUrl,
      filename: resource.title,
      fileType: resource.fileType,
      creditsRemaining: !isUploader
        ? user.downloadCredits - (existingDownload ? 0 : requiredCredits)
        : user.downloadCredits,
    });
  } catch (err) {
    console.error("Download handler error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Download failed",
      error: err.message,
    });
  }
};

// Helper function to generate download URL for raw files
const generateDownloadUrl = (originalUrl, filename) => {
  try {
    // For raw files, we modify the URL to add attachment flag
    // Original: https://res.cloudinary.com/demo/raw/upload/v1234/studyswap_uploads/file.pdf
    // Download: https://res.cloudinary.com/demo/raw/upload/fl_attachment/v1234/studyswap_uploads/file.pdf

    const url = new URL(originalUrl);
    const pathParts = url.pathname.split("/");

    // Find the upload part and insert fl_attachment after it
    const uploadIndex = pathParts.findIndex((part) => part === "upload");
    if (uploadIndex === -1) {
      throw new Error("Invalid Cloudinary URL format");
    }

    // Insert fl_attachment after upload
    pathParts.splice(uploadIndex + 1, 0, "fl_attachment");

    // Reconstruct the URL
    url.pathname = pathParts.join("/");

    // Add filename parameter for better download experience
    if (filename) {
      const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
      url.searchParams.set("filename", cleanFilename);
    }

    return url.toString();
  } catch (error) {
    console.error("Error generating download URL:", error);
    // Fallback: return original URL
    return originalUrl;
  }
};

// Get preview URL for a resource
const getPreviewUrl = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    const publicId = extractPublicIdFromUrl(resource.fileURL);

    // Generate preview URL (for PDFs, you can generate image previews)
    let previewUrl;

    if (resource.fileType === "application/pdf") {
      // Generate thumbnail of first page for PDF
      previewUrl = cloudinary.url(publicId, {
        resource_type: "image",
        type: "upload",
        format: "jpg",
        page: 1,
        width: 400,
        height: 600,
        crop: "fit",
        quality: "auto",
        secure: true,
      });
    } else {
      // For other files, return a generic preview or the file URL
      previewUrl = resource.fileURL;
    }

    return res.status(200).json({
      success: true,
      previewUrl: previewUrl,
      fileType: resource.fileType,
    });
  } catch (err) {
    console.error("❌ Preview error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to generate preview",
      error: err.message,
    });
  }
};

module.exports = {
  uploadResource,
  getResources,
  downloadResource,
  getPreviewUrl,
};

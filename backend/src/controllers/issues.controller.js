import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js"
import { Issues } from "../models/issues.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const registerIssues = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    coordinates,  // should be sent as a JSON stringified array in form-data
    isAnonymous
  } = req.body;

  // Basic validation
  if (!title || !description || !category || !coordinates) {
    throw new ApiError(400, "All fields are required");
  }

  // Upload multiple images (max 5)
  const uploadedImages = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploaded = await uploadOnCloudinary(file.path);
      if (uploaded?.url) uploadedImages.push(uploaded.url);
    }
  }

  // Create issue in DB
  const issue = await Issues.create({
    title,
    description,
    category,
    location: {
      type: "Point",
      coordinates: JSON.parse(coordinates) // send as "[76.7284,30.7046]" in Postman
    },
    isAnonymous: isAnonymous === "true", // since form-data sends strings
    user: req.user._id,
    images: uploadedImages
  });

  if (!issue) {
    throw new ApiError(500, "Something went wrong while registering issue");
  }

  res.status(201).json(
    new ApiResponse(201, issue._id, "Issue created successfully")
  );
});

const getAllIssues = asyncHandler(async (req, res) => {
  const issues = await Issues.find()
    .populate({
      path: 'user',
      select: '-passwordHash -email'
    });

  if (!issues) {
    return res.status(404).json({ success: false, message: "No issues found" });
  }

  res.status(200).json({
    success: true,
    message: "All issues fetched successfully",
    data: issues
  });
});


const getNearbyIssues = asyncHandler(async (req, res) => {
  const { radius } = req.query;

  // ✅ Validate allowed radius values
  const allowedRadius = [1, 3, 5];
  const parsedRadius = parseFloat(radius);
  if (!allowedRadius.includes(parsedRadius)) {
    return res.status(400).json({
      success: false,
      message: "Radius must be one of 1, 3, or 5 km"
    });
  }

  const user = await User.findById(req.user?._id);
  if (!user || !user.location || !user.location.coordinates) {
    return res.status(400).json({
      success: false,
      message: "User location not found"
    });
  }

  const [lng, lat] = user.location.coordinates;

  const issues = await Issues.find({
    location: {
      $geoWithin: {
        $centerSphere: [
          [lng, lat],
          parsedRadius / 6378.1
        ]
      }
    },
    isHidden: false
  });

  res.status(200).json({
    success: true,
    count: issues.length,
    data: issues
  });
});


const editIssueStatus = asyncHandler(async(req, res) => {
  const { issueId } = req.params;
  const { status } = req.body;
  const issue = await Issues.findById(issueId);
  if (!issue) {
    throw new ApiError(500, "Something went wrong in getting issue")
  }
  issue.status = status;
  await issue.save();
  res.status(200).json(
    new ApiResponse(200, "Issue status updated successfully")
  )
})

export {
    registerIssues,
    getAllIssues,
    getNearbyIssues,
    editIssueStatus
}
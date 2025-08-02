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
  const issues = await Issue.find()
  .populate({
    path: 'user',
    select: '-password'
  });

})

const getNearbyIssues = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng || !radius) {
      return res.status(400).json({ error: "lat, lng, and radius are required" });
    }

    const issues = await Issue.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)],
            parseFloat(radius) / 6378.1 // Earth radius in km
          ]
        }
      },
      isHidden: false
    });

    res.status(200).json(issues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch nearby issues" });
  }
};


export {
    registerIssues,
    getAllIssues,
    getNearbyIssues
}
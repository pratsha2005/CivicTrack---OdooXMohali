import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js"
import { Issues } from "../models/issues.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const registerIssues = asyncHandler(async(req, res) => {
    const {
      title,
      description,
      category,
      coordinates,  // [longitude, latitude]
      isAnonymous,
      images
    } = req.body;

    const issue = await Issue.create({
      title,
      description,
      category,
      location: {
        type: 'Point',
        coordinates
      },
      isAnonymous,
      user: req.user._id,
      images
    });

    const createdIssue = issue._id;
    if(!createdIssue){
        throw new ApiError(500, "Something went wrong while registering issue")
    }
    res.status(201).json(
        new ApiResponse(201, createdIssue, "Issue created successfully")
    );
})

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
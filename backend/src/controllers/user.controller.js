import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshTokens();
    const accessToken = user.generateAccessTokens();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required!");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Profile image is required!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Profile image couldn't be uploaded");
  }

  const user = await User.create({
    name,
    email,
    passwordHash: password,
    profileImageUrl: avatar.url,
    location: {
      type: "Point",
      coordinates: [0, 0]
    }
  });

  const createdUser = await User.findById(user._id).select("-passwordHash -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res.status(201).json(new ApiResponse(201, createdUser, "User created successfully!"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const validPassword = await user.isPasswordCorrect(password);
  if (!validPassword) {
    throw new ApiError(401, "Wrong password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-passwordHash -refreshToken");

  const options = {
    httpOnly: true,
    secure: false
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "Login successful"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: "" }
  });

  const options = {
    httpOnly: true,
    secure: false
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded?._id);
    if (!user || token !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is invalid or expired");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: false
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid token");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const { oldPassword, newPassword } = req.body;
  const validPassword = await user.isPasswordCorrect(oldPassword);
  if (!validPassword) {
    throw new ApiError(401, "Invalid old password");
  }

  user.passwordHash = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(201).json(new ApiResponse(201, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select("-passwordHash -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, user, "User found"));
});

const updateDetails = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name && !email) {
    throw new ApiError(400, "Please provide name or email to update");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { name, email } },
    { new: true }
  ).select("-passwordHash -refreshToken");

  return res.status(200).json(new ApiResponse(200, user, "User details updated successfully"));
});

const updateUserLocation = asyncHandler(async (req, res) => {
  const { coordinates } = req.body; // expects: [longitude, latitude]

  if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
    throw new ApiError(400, "Coordinates must be an array: [longitude, latitude]");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        location: {
          type: "Point",
          coordinates
        }
      }
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(
    new ApiResponse(200, user, "Location updated successfully")
  );
});

const updateNameAndAvatar = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name && !req.files?.avatar?.[0]?.path) {
    throw new ApiError(400, "Please provide at least one field: name or avatar");
  }

  const updates = {};

  if (name) updates.name = name;

  if (req.files?.avatar?.[0]?.path) {
    const uploaded = await uploadOnCloudinary(req.files.avatar[0].path);
    if (!uploaded?.url) {
      throw new ApiError(500, "Avatar upload failed");
    }
    updates.profileImageUrl = uploaded.url; // 🔁 corrected field name
  }

  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: updates
  }, { new: true }).select("-password -refreshToken");

  res.status(200).json(
    new ApiResponse(200, user, "User profile updated successfully")
  );
});


export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changePassword,
  updateDetails,
  updateUserLocation,
  updateNameAndAvatar
};

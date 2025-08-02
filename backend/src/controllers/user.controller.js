import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const refreshToken = user.generateRefreshTokens()
        const accessToken = user.generateAccessTokens()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    //get details from frontend
    //verification - empty
    //check if user already exists: username, email
    //check for images
    //upload them on cloudinary
    //create user object, create entry in db
    //remove password, refresh token from response to send to frontend
    //check for user creation
    //return response


    const {fullName, username, email, password} = req.body //JSON data body mei ayega
    // console.log(`email: ${email}, fullName: ${fullName}, username: ${username},
    //     password: ${password}`);

    //verification
    if([fullName, username, email, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required !")
    }

    // //check if user already exist
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    }) // to check if any user with same email or username exist in database
    if(existedUser){
        throw new ApiError(409, "User already exist")
    }
    

    // //check for avatar and coverImage
    // //since we have added multer middleware in route it gives us access to req.files
    const avatarLocalPath = req.files?.avatar[0]?.path //gets path of avatar if it exists in local server(public folder)
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required !")
    }

    //upload on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar couldn't be uploaded")
    }
   

    // // create user object
    const user = await User.create({
        fullName,
        username: username,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password
    })


    
    const createdUser = User.findById(user._id).select(
        "-passwrod -refreshToken"
    ) //remove password and refresh token from response

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering user")
    }
    // console.log(createdUser)
    // console.log(createdUser)
    return res.status(201).json(
       new ApiResponse(201, createdUser.schema, "User Created Successfully!!")
    )
})

const loginUser = asyncHandler( async (req, res) => {
    //get data of user
    //check if username exist
    //check password
    //generate refresh token and access token
    //give in form of cookies to user

    const {username, password, email} = req.body
    if(!username && !email){
        throw new ApiError(400, "Username and email is required")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user){
        throw new ApiError(404, "Unauthorised request")
    }
    const validPassword = await user.isPasswordCorrect(password)
    if(!validPassword){
        throw new ApiError(401, "Wrong Password")
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    const loggedInUser = await User.findById(user._id).select("-passwrod -refreshToken")


    //options for cookies
    const options = {
        httpOnly: true,
        secure: false
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {
            user: loggedInUser, accessToken, refreshToken
        }, "User logged in successfully")
    )
})

const logoutUser = asyncHandler( async (req, res, next) => {
    // remove cookies from user browser
    // remove refresh & access token from user model
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: false
    }
    res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {user}, "User logged out")
    )
})

const refreshAccessToken = asyncHandler( async(req, res) => {
    const token = req.cookies?.refreshToken || req.body.refreshToken
    if(!token) {
        throw new ApiError(401, "Unauthorised request")
    }
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decoded?._id)
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
        if(token !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)
        const options = {
            httpOnly: true,
            secure: false
        }
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(200, {accessToken, refreshToken: newRefreshToken}, "Access token refreshed")
        )


    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid token")
    }
})

const changePassword = asyncHandler( async(req, res) => {
    const user = await User.findById(req.user?._id)
    if(!user) {
        throw new ApiError(404, "User not found")
    }
    const { oldPassword, newPassword } = req.body
    const validPassword = await user.isPasswordCorrect(oldPassword)
    if(!validPassword){
        throw new ApiError(401, "Invalid old password")
    }
    user.password = newPassword
    await user.save({validateBeforeSave: false})
    return res
    .status(201)
    .json(
        new ApiResponse(201, {}, "Password changed successfully")
    )
})

const getCurrentUser = asyncHandler( async(req, res) => {
    const user = await User.findById(req.user?._id)
    .select("-password -refreshToken")
    if(!user){
        throw new ApiError(404, "User not found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "User found")
    )
})

const updateDetails = asyncHandler( async(req, res) => {
    const {fullName, email, username} = req.body
    if(!fullName && !email && !username){
        throw new ApiError(400, "Please provide all fields")
    }
    
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email,
                username
            }
        },
        {new: true}
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "User details updated successfully")
    )
    

})

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    changePassword,
    updateDetails
}; 
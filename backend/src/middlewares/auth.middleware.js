import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"


export const verifyJWT = asyncHandler(async(req, res, next) => {
    // get token from cookies as req has access to cookies 
    // because of cookie parser
    // or get it from header(in case of mobile browser)
    try {
        const token = req.cookies?.accessToken //key of token in cookie
        || req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            throw new ApiError(401, "Unauthorised request")
        }
        //verify token and get decoded info contained in it
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decoded?._id).select("-password -refreshToken") //_id is key of userid in token
        if(!user){
            throw new ApiError(401, "Invalid Token")
        }
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401 ,error?.message || "Invalid Access Token")
    }
})

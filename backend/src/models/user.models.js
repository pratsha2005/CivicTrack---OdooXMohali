import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

    const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    banned: {
        type: Boolean,
        default: false
    },
    profileImageUrl: {
        type: String // e.g. Cloudinary URL
    },
    location: {
        type: {
        type: String,
        enum: ["Point"],
        default: "Point"
        },
        coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
        }
    },
    refreshToken: {
        type: String
    }
    }, { timestamps: true });

// Indexing for geospatial queries
userSchema.index({ location: "2dsphere" });

// Middleware to hash passwordHash before saving (if modified)
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

// Password comparison
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Access token generation
userSchema.methods.generateAccessTokens = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: this.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};

// Refresh token generation
userSchema.methods.generateRefreshTokens = function () {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
};

export const User = mongoose.model("User", userSchema);

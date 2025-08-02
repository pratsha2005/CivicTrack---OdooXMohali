import mongoose, {Schema} from "mongoose";
import {User} from "./user.models.js";

const issuesSchema = mongoose.Schema({
    title: {
    type: String,
    required: true,
    maxlength: 255
  },
  description: {
    type: String,
    maxlength: 2000
  },
  category: {
    type: String,
    enum: ['Roads', 'Lighting', 'Water Supply', 'Cleanliness', 'Public Safety', 'Others'],
    required: true
  },
  images: {
    type: [String],
    validate: [arr => arr.length <= 5, '{PATH} exceeds the limit of 5']
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      default: [0, 0],
      index: '2dsphere' // for geo-queries
    }
  },
  status: {
    type: String,
    enum: ['Reported', 'In Progress', 'Resolved'],
    default: 'Reported'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  reports: {
    type: Number,
    default: 0
  },
  isHidden: {
    type: Boolean,
    default: false
  }
}, { timestamps : true})



export const Issues = mongoose.model("Issues", issuesSchema);
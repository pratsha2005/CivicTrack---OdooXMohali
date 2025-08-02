import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"

const connectDB = async () => {
    try {
        const connectDBInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("Connection Successfull !! \n")
    } catch (error) {
        console.error("ERROR : ", error)
        process.exit(1)
    }
}

export default connectDB;
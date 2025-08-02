import express, { urlencoded } from "express";
import cookieParser from "cookie-parser"; // to perform CRUD operation in user browser cookies
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); 

const app = express();
// cors middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json({
    limit: '16kb'
})) // to take data in form of json
app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}))  //to take data from url
app.use(express.static('public')) // name of folder
// cookieParser middleware
app.use(cookieParser())


// routes import
import userRouter from './routes/user.routes.js';
import issueRouter from './routes/issues.route.js'

// routes declaration
app.use("/api/v1/users", userRouter) //not app.get() because
// we have segragated routes and controller
app.use("/api/v1/issues", issueRouter)

export { app }
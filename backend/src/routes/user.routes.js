import { Router } from "express";
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  refreshAccessToken,
  changePassword, 
  getCurrentUser,
  updateUserLocation 
} from '../controllers/user.controller.js';
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    }
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// 🔐 Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/changepassword").post(verifyJWT, changePassword);
router.route("/update-location").post(verifyJWT, updateUserLocation);
router.route("/profile").get(verifyJWT, getCurrentUser);

export default router;

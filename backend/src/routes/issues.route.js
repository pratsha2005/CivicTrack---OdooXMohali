import { Router } from "express";
import { registerIssues, getAllIssues, getNearbyIssues } from "../controllers/issues.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/register-issue").post(verifyJWT, registerIssues)
router.route("/getAllIssues").get(getAllIssues)
router.route("/getNearbyIssues").get(verifyJWT, getNearbyIssues)



export default router;
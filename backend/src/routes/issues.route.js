import { Router } from "express";
import { registerIssues, getAllIssues, getNearbyIssues, editIssueStatus} from "../controllers/issues.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"; // 🆕

const router = Router();

router
  .route("/register-issue")
  .post(
    verifyJWT,
    upload.array("images", 5), 
    registerIssues
  );

router.route("/getAllIssues").get(getAllIssues);
router.route("/getNearbyIssues").get(verifyJWT, getNearbyIssues);
router.route("/editIssue/:issueId").post(editIssueStatus)

export default router;

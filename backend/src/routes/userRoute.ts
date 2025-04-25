import { Router } from "express";

import {
  signUp,
  signIn,
  verifyUser,
  checkUniqueUserName,
  getAllPartially,
  getPartially,
  updatePartially,
} from "../controllers/userController.ts";

const router = Router();

router.route("/profile/sign-up").post(signUp);
router.route("/profile/sign-in").post(signIn);
router.route("/profile/verify-user").post(verifyUser);
router.route("/profile/check-unique/:username").get(checkUniqueUserName);

router.route("/").get(getAllPartially);
router.route("/:id").get(getPartially).put(updatePartially);

export default router;

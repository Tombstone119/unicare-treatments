import { Router } from "express";

import {
  checkUniqueUserName,
  getPartialUser,
  signInUser,
  signUpUser,
  updatePartialUser,
  verifyUser,
} from "../controllers/userController.ts";

const router = Router();

router
  .route("/profile/check-username-unique/:username")
  .get(checkUniqueUserName);
router.route("/profile/sign-up").post(signUpUser);
router.route("/profile/verify-code").post(verifyUser);
router.route("/profile/sign-in").post(signInUser);

router.route("/:id").get(getPartialUser).post(updatePartialUser);

export default router;

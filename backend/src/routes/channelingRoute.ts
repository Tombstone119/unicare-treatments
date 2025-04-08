import {
  createChanneling,
  getActiveChanneling,
  getChanneling,
  getChannelingByDate,
} from "../controllers/channelingController.ts";
import { Router } from "express";

const router = Router();

router.route("/").get(getChanneling).post(createChanneling);
router.route("/:channelingDate").get(getChannelingByDate);
router.route("/active/:currentDate").get(getActiveChanneling);

export default router;

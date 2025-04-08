import { getChanneling } from "../controllers/channelingController.ts";
import { Router } from "express";

const router = Router();

router.route("/").get(getChanneling).post();

export default router;

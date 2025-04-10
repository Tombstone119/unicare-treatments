import { Router } from "express";

import {
  getPatientById,
  getAllPatients,
} from "../controllers/appointmentController.ts";

const router = Router();

router.route("/patient").get(getAllPatients);
router.route("/patient/:patientId").get(getPatientById);

export default router;

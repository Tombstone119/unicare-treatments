import { Router } from "express";

import {
  createPatientAppointment,
  getPatientById,
  getAllPatients,
} from "../controllers/appointmentController.ts";

const router = Router();

router.route("/patientAppointments").post(createPatientAppointment);
router.route("/patient").get(getAllPatients);
router.route("/patient/:patientId").get(getPatientById);

export default router;

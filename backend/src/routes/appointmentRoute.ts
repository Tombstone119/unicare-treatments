import { Router } from "express";

import {
  getPatientById,
  getAllPatients,
  getByAppointmentId,
  updateAppointment,
  sendPaymentRequest,
} from "../controllers/appointmentController.ts";

const router = Router();

router.route("/update/:appointmentId").put(updateAppointment);
router.route("/patient").get(getAllPatients);
router.route("/patient/:patientId").get(getPatientById);
router.route("/all/:appointmentId").get(getByAppointmentId);
router.route("/payment/request").post(sendPaymentRequest);

export default router;

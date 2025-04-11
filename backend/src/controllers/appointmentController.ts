import appointmentService from "../services/appointmentService.ts";
import { Response, Request } from "express";
import HttpStatusCodes from "../util/statusCodes.ts";
import { handleError } from "../util/errorHandler.ts";

export const getPatientById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { patientId } = req.params;
    const appointments = await appointmentService.getById(patientId);
    res.status(HttpStatusCodes.OK).json({
      success: true,
      appointments,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getByAppointmentId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { appointmentId } = req.params;
    const appointment = await appointmentService.getByAppointmentId(
      appointmentId
    );
    res.status(HttpStatusCodes.OK).json({
      success: true,
      appointment,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { appointmentId } = req.params;
    const {
      sendEmailReceipt,
      email,
      name,
      paymentId,
      paymentStatus,
      appointmentStatus,
      paymentAmount,
    } = req.body;
    const updatedAppointment = await appointmentService.update(
      appointmentId,
      sendEmailReceipt,
      email,
      name,
      paymentId,
      paymentStatus,
      appointmentStatus,
      paymentAmount
    );
    res.status(HttpStatusCodes.OK).json({
      success: true,
      updatedAppointment,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getAllPatients = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    const appointments = await appointmentService.getAll();
    res.status(HttpStatusCodes.OK).json({
      success: true,
      appointments,
    });
  } catch (error) {
    handleError(res, error);
  }
};

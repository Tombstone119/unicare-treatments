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

import channelingService from "../services/channelingService.ts";
import { handleError } from "../util/errorHandler.ts";
import HttpStatusCodes from "../util/statusCodes.ts";
import { Response, Request } from "express";

export const getChanneling = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    const appointments = await channelingService.getAll();
    res.status(HttpStatusCodes.OK).json({
      success: true,
      appointments,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const createChanneling = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    const channeling = await channelingService.create();
    res.status(HttpStatusCodes.OK).json({
      success: true,
      channeling,
    });
  } catch (error) {
    handleError(res, error);
  }
};

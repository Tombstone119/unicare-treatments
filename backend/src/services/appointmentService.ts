import {
  IPatientAppointment,
  IDoctorAppointment,
} from "../types/appointment.ts";
import AppointmentModel from "../models/appointmentModel.ts";
import mongoose from "mongoose";
import ChannelingModel from "@src/models/channelingModel.ts";

async function createAppointmentByPatient(appointment: IPatientAppointment) {
  try {
    const appointmentDate = new Date(appointment.appointmentDate);
    const newPatientAppointment = new AppointmentModel({
      patientId: appointment.patientId,
      appointmentDate: appointmentDate,
    });
    await newPatientAppointment.save();
    return newPatientAppointment;
  } catch (error) {
    throw error;
  }
}

async function getById(patientId: string) {
  const matchStage = patientId
    ? { patientId: new mongoose.Types.ObjectId(patientId) }
    : {};
  const appointments = await AppointmentModel.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users", // The collection name for users
        localField: "patientId", // Field from appointments
        foreignField: "_id", // Field from users
        as: "userDetails", // The name of the new array field
      },
    },
    { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        appointmentDate: 1,
        firstName: "$userDetails.firstName",
        lastName: "$userDetails.lastName",
        email: "$userDetails.email",
        phoneNumber: "$userDetails.phoneNumber",
        referenceNumber: "$_id",
      },
    },
  ]);

  return appointments;
}

const getAll = async () => {
  const allAppointments = await AppointmentModel.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "patientId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        appointmentDate: 1,
        firstName: "$userDetails.firstName",
        lastName: "$userDetails.lastName",
        email: "$userDetails.email",
        phoneNumber: "$userDetails.phoneNumber",
        referenceNumber: "$_id",
      },
    },
  ]);
  return allAppointments;
};

export default {
  createAppointmentByPatient,
  getById,
  getAll,
};

import AppointmentModel from "../models/appointmentModel.ts";
import mongoose from "mongoose";

async function getByAppointmentId(appointmentId: string) {
  const appointments = await AppointmentModel.findOne({
    _id: appointmentId,
  });
  return appointments;
}

async function update(
  appointmentId: string,
  appointmentData: {
    paymentId: string;
    paymentStatus: string;
    appointmentStatus: string;
    paymentAmount: number;
  }
) {
  const appointment = await AppointmentModel.findByIdAndUpdate(
    appointmentId,
    {
      ...appointmentData,
    },
    { new: true }
  );
  if (!appointment) {
    throw new Error("Appointment not found");
  }
  return appointment;
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
        channelingDate: 1,
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
        channelingDate: 1,
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
  update,
  getById,
  getAll,
  getByAppointmentId,
};

import AppointmentModel from "../models/appointmentModel.ts";
import mongoose from "mongoose";
import { resend } from "../util/resend.ts";

async function getByAppointmentId(appointmentId: string) {
  const appointments = await AppointmentModel.findOne({
    _id: appointmentId,
  });
  return appointments;
}

async function sendPaymentRequest(
  appointmentId: string,
  email: string,
  userId: string
) {
  const appointment = await AppointmentModel.findOne({
    _id: appointmentId,
  });
  await resend.emails.send({
    from: "contact@duminda.net",
    to: email,
    subject: "Please Make Your Payment",
    html: `
    <h1>Unicare Treatments</h1>
    <p>If you don't do this payment today, it will be cancelled</p>
    <p><strong>Reference ID:</strong> ${appointmentId}</p>
    <p><strong>Amount To Be Paid:</strong> ${appointment?.paymentAmount}</p>
    <p><strong>Date:</strong> ${appointment?.channelingDate}</p>
    <p><strong>Time:</strong> Session ${appointment?.sessionNumber} (${appointment?.startingTime} - ${appointment?.endingTime})</p>
    <p><strong>Doctor:</strong> ${appointment?.doctorName}</p>
    <a href="${process.env.FRONTEND_URL}/appointment-payment?appointmentId=${appointmentId}&userId=${userId}">Click here to make your payment</a>
    `,
  });
  return true;
}

async function update(
  appointmentId: string,
  sendEmailReceipt: boolean,
  email: string,
  name: string,
  paymentId: string,
  paymentStatus: string,
  appointmentStatus: string,
  paymentAmount: number
) {
  const appointment = await AppointmentModel.findByIdAndUpdate(
    appointmentId,
    {
      paymentId: paymentId,
      paymentStatus: paymentStatus,
      appointmentStatus: appointmentStatus,
      paymentAmount: paymentAmount,
    },
    { new: true }
  );
  if (!appointment) {
    throw new Error("Appointment not found");
  }
  if (sendEmailReceipt) {
    await resend.emails.send({
      from: "contact@duminda.net",
      to: email,
      subject: "Your Appointment Receipt",
      html: `
      <h1>Unicare Treatments</h1>
      <p><strong>Patient Name:</strong> ${name}</p>
      <p><strong>Reference ID:</strong> ${appointment?.patientId}</p>
      <p><strong>Amount Paid:</strong> ${appointment?.paymentAmount}</p>
      <p><strong>Date:</strong> ${appointment?.channelingDate}</p>
      <p><strong>Time:</strong> Session ${appointment?.sessionNumber} (${appointment?.startingTime} - ${appointment?.endingTime})</p>
      <p><strong>Doctor:</strong> ${appointment?.doctorName}</p>
      `,
    });
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
        patientId: 1,
        channelingDate: 1,
        sessionNumber: 1,
        startingTime: 1,
        endingTime: 1,
        paymentId: 1,
        paymentStatus: 1,
        doctorName: 1,
        appointmentStatus: 1,
        paymentAmount: 1,
        firstName: "$userDetails.firstName",
        lastName: "$userDetails.lastName",
        email: "$userDetails.email",
        phoneNumber: "$userDetails.phoneNumber",
        referenceNumber: "$_id",
        createdAt: 1,
        updatedAt: 1,
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
        patientId: 1,
        channelingDate: 1,
        sessionNumber: 1,
        startingTime: 1,
        endingTime: 1,
        paymentId: 1,
        paymentStatus: 1,
        doctorName: 1,
        appointmentStatus: 1,
        paymentAmount: 1,
        firstName: "$userDetails.firstName",
        lastName: "$userDetails.lastName",
        email: "$userDetails.email",
        phoneNumber: "$userDetails.phoneNumber",
        referenceNumber: "$_id",
        createdAt: 1,
        updatedAt: 1,
      },
    },
    // {
    //   $sort: { channelingDate: -1 }, // 1 for ascending, -1 for descending
    // },
  ]);
  return allAppointments;
};

export default {
  update,
  getById,
  getAll,
  getByAppointmentId,
  sendPaymentRequest,
};

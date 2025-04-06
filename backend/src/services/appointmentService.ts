import {
  IPatientAppointment,
  IDoctorAppointment,
} from "../types/appointment.ts";
import AppointmentModel from "../models/appointmentModel.ts";

const generateSequentialReference = async (
  appointmentDate: Date
): Promise<string> => {
  const day = String(appointmentDate.getDate()).padStart(2, "0");
  const month = String(appointmentDate.getMonth() + 1).padStart(2, "0");
  const year = String(appointmentDate.getFullYear()).slice(-2);

  // Note: fetch number of the records in the current date and increment it by one
  const count = await AppointmentModel.countDocuments({ appointmentDate });
  const sequentialNumber = String(count + 1).padStart(4, "0");

  return `${day}${month}${year}${sequentialNumber}`;
};

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

// async function createAppointmentByDoctor(appointment: IDoctorAppointment) {
//   try {
//     // Note: reference number generation
//     const appointmentDate = new Date(appointment.appointmentDate);
//     const referenceNumber = await generateSequentialReference(appointmentDate);

//     const newDoctorAppointment = new AppointmentModel({
//       referenceNumber,
//       firstName: appointment.firstName,
//       phoneNumber: appointment.phoneNumber,
//       appointmentDate: appointmentDate,
//     });

//     await newDoctorAppointment.save();
//     return newDoctorAppointment;
//   } catch (error) {
//     throw error;
//   }
// }

// async function getAllByPatientId(patientId: string) {
//   const appointment = await AppointmentModel.find({ patientId });
//   return appointment;
// }

// async function getAllByDate(date: string | Date) {
//   const start = new Date(date);
//   start.setHours(0, 0, 0, 0); // Start of the day

//   const end = new Date(date);
//   end.setHours(23, 59, 59, 999); // End of the day

//   return await AppointmentModel.find({
//     appointmentDate: { $gte: start, $lte: end },
//   });
// }

// async function getAllAppointments() {
//   const allAppointments = await AppointmentModel.find();
//   return allAppointments;
// }

// async function findByRefNo(referenceNumber: string) {
//   return await AppointmentModel.findOne({ referenceNumber });
// }

// async function getPatientIdByRefNo(referenceNumber: string) {
//   const appointment = await AppointmentModel.findOne({
//     referenceNumber,
//   }).select("patientId");
//   return appointment?.patientId || "user not found";
// }

// async function rescheduleAppointmentById(id: string, appointmentDate: Date) {
//   const updatedAppointment = await AppointmentModel.findOneAndUpdate(
//     { _id: id },
//     { appointmentDate: appointmentDate },
//     { new: true }
//   );
//   return updatedAppointment;
// }

// async function rescheduleAppointmentByRefNo({
//   referenceNumber,
//   appointment,
// }: {
//   referenceNumber: string;
//   appointment: IPatientAppointment;
// }) {
//   try {
//     // Note: reference number generation
//     const appointmentDate = new Date(appointment.appointmentDate);
//     const referenceNumber = await generateSequentialReference(appointmentDate);

//     const updatedAppointment = await AppointmentModel.findOneAndUpdate(
//       { referenceNumber }, // Find appointment by refNo
//       {
//         firstName: appointment.firstName,
//         lastName: appointment.lastName,
//         dateOfBirth: new Date(appointment.dateOfBirth),
//         gender: appointment.gender,
//         maritalState: appointment.maritalState,
//         phoneNumber: appointment.phoneNumber,
//         alternativePhoneNumber: appointment.alternativePhoneNumber,
//         email: appointment.email,
//         address: appointment.address,
//         appointmentDate: appointmentDate,
//         paymentStatus: appointment.paymentStatus,
//       },
//       { new: true } // Return the updated document
//     );

//     if (!updatedAppointment) {
//       throw new Error("Appointment not found for rescheduling.");
//     }

//     return updatedAppointment;
//   } catch (error) {
//     console.error("Error in createAppointmentByPatient:", error);
//     throw error;
//   }
// }

// async function deleteByRefNo(referenceNumber: string) {
//   const deletedAppointment = await AppointmentModel.findOneAndDelete({
//     referenceNumber,
//   });
//   return deletedAppointment;
// }

// async function deleteAllByDate(date: string | Date) {
//   const start = new Date(date);
//   start.setHours(0, 0, 0, 0); // Start of the day

//   const end = new Date(date);
//   end.setHours(23, 59, 59, 999); // End of the day

//   return await AppointmentModel.deleteMany({
//     appointmentDate: { $gte: start, $lte: end },
//   });
// }

export default {
  createAppointmentByPatient,
  // rescheduleAppointmentById,
  // generateSequentialReference,
  // createAppointmentByPatient,
  // createAppointmentByDoctor,

  // getAllByPatientId,
  // getAllByDate,
  // getAllAppointments,
  // findByRefNo,
  // getPatientIdByRefNo,

  // rescheduleAppointmentByRefNo,

  // deleteByRefNo,
  // deleteAllByDate,
};

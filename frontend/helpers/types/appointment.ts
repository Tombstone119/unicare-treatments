import { TApiResponse } from "./common";

// export interface IAppointment {
//     _id?: string;
//     patientId?: string;
//     firstName?: string;
//     lastName?: string;
//     dateOfBirth?: string;
//     email?: string;
//     gender?: string;
//     channelingDate?: string;
//     referenceNumber?: string;
//     maritalState?: string;
//     paymentStatus?: string;
//     address?: string;
//     phoneNumber?: string;
//     alternativePhoneNumber?: string;
//     createdAt?: string;
//     updatedAt?: string;
//   }

export interface IAppointment {
  _id: string;
  channelingDate: string;
  patientId: string;
  paymentId: string;
  paymentStatus: "pending" | "completed" | "cancelled";
  sessionNumber: number;
  startingTime: string;
  endingTime: string;
  doctorName: string;
  appointmentStatus: "waiting" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentResponse extends TApiResponse {
  appointments?: IAppointment[];
  appointment?: IAppointment;
}

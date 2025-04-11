import { TApiResponse } from "./common";

export interface IAppointment {
  _id: string;
  patientId: string;
  channelingDate: string;
  sessionNumber: number;
  startingTime: string;
  endingTime: string;
  paymentId: string;
  paymentStatus: "pending" | "completed" | "cancelled";
  doctorName: string;
  appointmentStatus: "waiting" | "completed" | "cancelled";
  paymentAmount: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  referenceNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentResponse extends TApiResponse {
  appointments?: IAppointment[];
  appointment?: IAppointment;
}

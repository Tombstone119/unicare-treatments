/******************************************************************************
                                Types
******************************************************************************/

export interface IPatientAppointment {
  patientId?: string;
  appointmentDate: string;
}

export interface IDoctorAppointment {
  firstName: string;
  phoneNumber: string;
  appointmentDate: string;
}

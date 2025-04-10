import { IAppointment } from "./appointment";
import { TApiResponse } from "./common";

export type Sessions = {
  start: string;
  end: string;
  number: string;
};

export type TimeSlot = {
  start: string;
  end: string;
  isActive: boolean;
  appointmentId?: string;
};

export interface ChannelingResponse extends TApiResponse {
  channeling: {
    channelingDate: string;
    channelingSlots: TimeSlot[][];
  };
  dates: string[];
}

export interface NewChannelingResponse extends TApiResponse {
  channeling: {
    channelingDate: string;
    channelingSlots: TimeSlot[][];
  };
  appointment: IAppointment;
}

export interface ChannelingWithDates extends TApiResponse {
  dates: string[];
}

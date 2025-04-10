import { TApiResponse } from "./common";

export interface IUser {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  role: string;
  reports?: string[];
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  address?: string;
  maritalState?: "single" | "married" | "divorced" | "widowed";
  gender?: "male" | "female" | "other";
}

export type userTypes = "doctor" | "admin" | "supplier" | "patient";

export interface UserApiResponse extends TApiResponse {
  user?: IUser;
}

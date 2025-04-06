import { Schema, model, Types } from "mongoose";

const AppointmentSchema = new Schema(
  {
    patientId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AppointmentModel = model("appointment", AppointmentSchema);
export default AppointmentModel;

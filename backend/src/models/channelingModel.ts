import { Schema, model, Types } from "mongoose";

const ChannelingSchema = new Schema(
  {
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentSlots: {
      type: [[String]],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChannelingModel = model("channeling", ChannelingSchema);

export default ChannelingModel;

import ChannelingModel from "../models/channelingModel.ts";

const getAll = async () => {
  const channeling = await ChannelingModel.find();
  return channeling;
};

const create = async () => {
  const channeling = await ChannelingModel.create({
    appointmentDate: new Date("2025-05-01"),
    appointmentSlots: [
      ["10.00", "10.30", "11.00", "11.30"],
      ["13.00", "13.30", "14.00", "14.30"],
      ["16.00", "16.30", "17.00", "17.30"],
    ],
  });
  return channeling;
};

const update = async (appointmentId: string) => {
  const channeling = await ChannelingModel.findByIdAndUpdate(appointmentId, {
    $set: {
      appointmentSlots: [
        ["10.00", "10.30", "11.00", "11.30"],
        ["13.00", "13.30", "14.00", "14.30"],
      ],
    },
  });
  return channeling;
};

const add = async (appointmentId: string) => {
  const channeling = await ChannelingModel.findByIdAndUpdate(appointmentId, {
    $push: {
      appointmentSlots: ["18.00", "18.30", "19.00"],
    },
  });
  return channeling;
};

export default {
  getAll,
  create,
  update,
  add,
};

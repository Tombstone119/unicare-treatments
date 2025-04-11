import AppointmentModel from "../models/appointmentModel.ts";
import ChannelingModel from "../models/channelingModel.ts";
import { IChanneling } from "../types/channeling.ts";

const getAll = async () => {
  const channeling = await ChannelingModel.find();
  return channeling;
};

const getActive = async (currentDate: string) => {
  const channeling = await ChannelingModel.find({
    channelingDate: { $gte: currentDate },
  }).select({
    channelingDate: 1,
    _id: 0,
  });
  return channeling;
};

const getByDate = async (channelingDate: string) => {
  const channeling = await ChannelingModel.findOne({
    channelingDate: channelingDate,
  });
  return channeling;
};

const create = async (channelingDate: string, channelingSlots: string[][]) => {
  const existingChanneling = await ChannelingModel.findOne({
    channelingDate: channelingDate,
  });
  if (existingChanneling) {
    const updatedChanneling = await ChannelingModel.findOneAndUpdate(
      { channelingDate: channelingDate },
      {
        $set: { channelingSlots: channelingSlots },
      },
      { new: true } // Return the updated document
    );
    return updatedChanneling;
  }
  const channeling = await ChannelingModel.create({
    channelingDate: channelingDate,
    channelingSlots: channelingSlots,
  });
  return channeling;
};

const makeChanneling = async (channel: IChanneling) => {
  const newAppointment = new AppointmentModel({
    patientId: channel.patientId,
    channelingDate: channel.channelingDate,
    sessionNumber: channel.session,
    startingTime: channel.starting,
    endingTime: channel.ending,
  });
  await newAppointment.save();
  const newChanneling = await ChannelingModel.findOneAndUpdate(
    {
      channelingDate: channel.channelingDate,
      [`channelingSlots.${channel.session - 1}.start`]: channel.starting,
    },
    {
      $set: {
        [`channelingSlots.${channel.session - 1}.$[elem].appointmentId`]:
          newAppointment._id,
      },
    },
    {
      arrayFilters: [{ "elem.start": channel.starting }],
      new: true, // Return the updated document
    }
  );

  return {
    appointment: newAppointment,
    channeling: newChanneling,
  };
};

export default {
  getAll,
  getActive,
  getByDate,
  create,
  makeChanneling,
};

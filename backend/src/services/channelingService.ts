import ChannelingModel from "../models/channelingModel.ts";

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

const makeChanneling = async (
  session: number,
  channelingDate: string,
  starting: string,
  patientId: string
) => {
  const result = await ChannelingModel.findOneAndUpdate(
    {
      channelingDate: channelingDate,
      [`channelingSlots.${session}.start`]: starting,
    },
    {
      $set: { [`channelingSlots.${session}.$[elem].patientId`]: patientId },
    },
    {
      arrayFilters: [{ "elem.start": starting }],
      new: true, // Return the updated document
    }
  );

  return result;
};

export default {
  getAll,
  getActive,
  getByDate,
  create,
  makeChanneling,
};

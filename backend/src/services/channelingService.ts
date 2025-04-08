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

const update = async (channelingDate: string, channelingSlots: string[][]) => {
  const updatedChanneling = await ChannelingModel.findOneAndUpdate(
    { channelingDate: channelingDate },
    {
      $set: { channelingSlots: channelingSlots },
    },
    { new: true } // Return the updated document
  );
  return updatedChanneling;
};

// const add = async (channelingId: string) => {
//   const channeling = await ChannelingModel.findByIdAndUpdate(channelingId, {
//     $push: {
//       appointmentSlots: ["18.00", "18.30", "19.00"],
//     },
//   });
//   return channeling;
// };

export default {
  getAll,
  getActive,
  getByDate,
  create,
  update,
  // add,
};

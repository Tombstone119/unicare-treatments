import { TimeSlot } from "@/types/users";

export const getDataFiltered = (data: TimeSlot[]) => {
  const active = data.filter((slot) => slot.isActive === true);
  const index = active.findIndex((slot) => !slot.patientId);
  if (index < 0) {
    return undefined;
  }
  return {
    start: active[index].start,
    end: active[index].end,
    number: (index + 1).toString(),
  };
};

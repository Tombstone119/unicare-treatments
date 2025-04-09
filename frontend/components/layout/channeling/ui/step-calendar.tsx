import { ArrowLeft } from "lucide-react";
import { FaCalendarAlt } from "react-icons/fa";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { Calendar } from "@/shadcn/ui/calendar";
import { toast } from "sonner";
import { apiService } from "@/libs/api";
import { ChannelingResponse, DatesResponse } from "@/types/users";
import PatientCalender from "@/channeling/widgets/patient-calendar";
import { cn } from "@/libs/utils";
import { Sessions } from "@/types/channeling";

export default function FirstStep({
  handleSetStep,
  date,
  setDate,
}: {
  handleSetStep: (num: -1 | 1) => void;
  date: Date | null;
  setDate: Dispatch<SetStateAction<Date | null>>;
}) {
  const [loading, setLoading] = useState(false);
  const [allowedDates, setAllowedDates] = useState<Date[]>([]);
  const [firstSession, setFirstSession] = useState<Sessions>();
  const [secondSession, setSecondSession] = useState<Sessions>();
  const [thirdSession, setThirdSession] = useState<Sessions>();
  const [selectedSession, setSelectedSession] = useState<
    "first" | "second" | "third"
  >();

  const sessions = {
    firstSession,
    secondSession,
    thirdSession,
  };

  const getAllActive = async () => {
    try {
      const formattedDate = format(new Date(), "dd-MM-yyyy");
      const response = await apiService.get<DatesResponse>(
        `/channeling/active/${formattedDate}`
      );
      const convertedDates = response.dates.map((dateStr) =>
        parse(dateStr, "dd-MM-yyyy", new Date())
      );
      setAllowedDates(convertedDates);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const getData = async (selectedDate: Date) => {
    try {
      setLoading(true);
      const formattedDate = format(selectedDate, "dd-MM-yyyy");
      const response = await apiService.get<ChannelingResponse>(
        `/channeling/${formattedDate}`
      );
      const firstSessionArray = response.channeling.channelingSlots[0];
      const firstEmptySlot = firstSessionArray.findIndex(
        (slot) => slot.isActive === true && !slot.patientId
      );
      if (firstEmptySlot < 0) {
        setFirstSession(undefined);
      } else {
        setFirstSession({
          start: firstSessionArray[firstEmptySlot].start,
          end: firstSessionArray[firstEmptySlot].end,
          number: (firstEmptySlot + 1).toString(),
        });
      }
      const secondSessionArray = response.channeling.channelingSlots[1];
      const secondEmptySlot = secondSessionArray.findIndex(
        (slot) => slot.isActive === true && !slot.patientId
      );
      if (secondEmptySlot < 0) {
        setSecondSession(undefined);
      } else {
        setSecondSession({
          start: secondSessionArray[secondEmptySlot].start,
          end: secondSessionArray[secondEmptySlot].end,
          number: (secondEmptySlot + 1).toString(),
        });
      }
      const thirdSessionArray = response.channeling.channelingSlots[2];
      const thirdEmptySlot = thirdSessionArray.findIndex(
        (slot) => slot.isActive === true && !slot.patientId
      );
      if (thirdEmptySlot < 0) {
        setThirdSession(undefined);
      } else {
        setThirdSession({
          start: thirdSessionArray[thirdEmptySlot].start,
          end: thirdSessionArray[thirdEmptySlot].end,
          number: (thirdEmptySlot + 1).toString(),
        });
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllActive();
  }, []);

  const isDateAllowed = (date: Date) => {
    return allowedDates.some(
      (allowedDate) => allowedDate.toDateString() === date.toDateString()
    );
  };

  const handleSelectDate = (selectedDate: { date: Date }) => {
    setDate(selectedDate.date);
    getData(selectedDate.date);
  };

  return (
    <div className="flex flex-col min-h-[488px] items-center justify-center gap-10">
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Select a Date
      </h1>
      <div
        className={cn(
          "relative flex items-center text-indigo-950 gap-5",
          loading && "opacity-50"
        )}
      >
        <PatientCalender
          date={date}
          sessions={sessions}
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
        />
        <Calendar
          holidays={allowedDates}
          mode="single"
          selected={date || undefined}
          onSelect={(selectedDate: Date | undefined) => {
            if (selectedDate && isDateAllowed(selectedDate)) {
              // setDate(selectedDate);
              handleSelectDate({ date: selectedDate });
            }
          }}
          disabled={(day) => !isDateAllowed(day)}
          className="w-[280px] rounded-md shadow-md p-2 border-black border-2"
        />
      </div>
      <div className="flex items-center gap-5">
        <button
          className="px-4 py-2 rounded border-2 border-black text-black flex items-center gap-2 justify-center min-w-[196px]"
          onClick={() => {
            handleSetStep(-1);
          }}
        >
          <ArrowLeft className="h-5 w-5 text-black" />
          Go Back
        </button>
        <button
          className="px-4 py-2 rounded bg-black text-white flex items-center gap-2 justify-center"
          onClick={() => {
            handleSetStep(1);
          }}
        >
          <FaCalendarAlt />
          Save and Continue
        </button>
      </div>
    </div>
  );
}

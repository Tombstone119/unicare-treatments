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
import { getDataFiltered } from "@/libs/channeling";

const selectedData = {
  first: 0,
  second: 1,
  third: 2,
};
export default function FirstStep({
  handleSetStep,
  date,
  setDate,
  userId,
}: {
  handleSetStep: (num: -1 | 1) => void;
  date: Date | null;
  setDate: Dispatch<SetStateAction<Date | null>>;
  userId: string | undefined;
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

  const updateChanneling = async () => {
    try {
      if (!date) {
        return;
      }
      const formattedDate = format(date, "dd-MM-yyyy");

      const sessionArr = [firstSession, secondSession, thirdSession];

      await apiService.post<DatesResponse>(`/channeling/make-channeling`, {
        session: selectedData[selectedSession as keyof typeof selectedData],
        channelingDate: formattedDate,
        start:
          sessionArr[selectedData[selectedSession as keyof typeof selectedData]]
            ?.start,
        patientId: userId,
      });
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
      setFirstSession(
        getDataFiltered(response?.channeling?.channelingSlots[0] || [])
      );
      setSecondSession(
        getDataFiltered(response?.channeling?.channelingSlots[1] || [])
      );
      setThirdSession(
        getDataFiltered(response?.channeling?.channelingSlots[2] || [])
      );
      toast.success("success");
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
            updateChanneling();
            // handleSetStep(1);
          }}
        >
          <FaCalendarAlt />
          Save and Continue
        </button>
      </div>
    </div>
  );
}

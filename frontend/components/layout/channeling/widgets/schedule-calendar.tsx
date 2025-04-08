import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { format, isAfter, isSameDay, startOfDay } from "date-fns";
import { Calendar } from "@/shadcn/ui/calendar";
import { cn } from "@/libs/utils";
import { first, second, third } from "@/helpers/data/time.data";
import { FaArrowDown, FaArrowLeft, FaClock } from "react-icons/fa";
import { Button } from "@/shadcn/ui/button";

type TimeSlot = {
  start: string;
  end: string;
  isActive: boolean;
};

type SetAction = Dispatch<SetStateAction<TimeSlot[]>>;
export const ScheduleCalendar = ({
  date,
  setDate,
}: {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
}) => {
  const [firstSession, setFirstSession] = useState<TimeSlot[]>(first);
  const [secondSession, setSecondSession] = useState<TimeSlot[]>(second);
  const [thirdSession, setThirdSession] = useState<TimeSlot[]>(third);

  const handleSessionClick = (session: SetAction, timeIndex: number) => {
    if (isDisabled) return;
    session((prev) =>
      prev.map((item, i) => ({
        ...item,
        isActive: i === timeIndex ? !item.isActive : item.isActive,
      }))
    );
  };
  const [totalCount, firstCount, secondCount, thirdCount] = useMemo(() => {
    const firstTotal = firstSession.filter((time) => time.isActive).length;
    const secondTotal = secondSession.filter((time) => time.isActive).length;
    const thirdTotal = thirdSession.filter((time) => time.isActive).length;
    const total = firstTotal + secondTotal + thirdTotal;
    return [total, firstTotal, secondTotal, thirdTotal];
  }, [firstSession, secondSession, thirdSession]);

  const isANewDay = useMemo(() => {
    const today = new Date();
    return isSameDay(date, today) || isAfter(date, startOfDay(today));
  }, [date]);
  const isDisabled = !isANewDay;
  return (
    <div className="relative flex items-end text-indigo-950 gap-5 w-full mb-4">
      <div className="flex flex-col gap-7">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate: Date | undefined) => {
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
          className="w-[280px] rounded-xl shadow-md p-2 border-black border-2"
        />
        <div className="relative flex flex-col gap-5 border-2 border-dashed border-black p-4 shadow-md rounded-xl">
          <div>
            <span className="font-semibold">Total Patients : </span>
            <span>{totalCount}</span>
          </div>

          <div>
            <span className="font-semibold">First Session : </span>
            <span>{firstCount}</span>
          </div>
          <div>
            <span className="font-semibold">Second Session : </span>
            <span>{secondCount}</span>
          </div>
          <div>
            <span className="font-semibold">Third Session : </span>
            <span>{thirdCount}</span>
          </div>
          <div className="ribbon bg-gray-300 text-black">Patient Count</div>
        </div>
        <Button disabled={isDisabled}>Submit</Button>
      </div>

      <div className="relative border-2 border-black bg-black flex-none shadow-md rounded-xl">
        <div className="flex items-center justify-center px-1.5 py-0.5">
          <span className="text-center text-white">
            {format(date, "do")} of {format(date, "LLLL")},{" "}
            {format(date, "yyyy")}
          </span>
        </div>
        <div className="rounded-br-xl rounded-bl-xl bg-white grid grid-cols-3 gap-8 px-8 py-4">
          <div>
            <div className="text-center font-semibold">Session 1</div>
            <div className="flex flex-col gap-2">
              {firstSession.map((time, index) => (
                <div
                  key={`first-time-slots-${index + 1}`}
                  className={cn(
                    "px-4 rounded-full cursor-pointer flex gap-2 items-center",
                    {
                      "border-black border-2 text-black": time.isActive,
                      "bg-gray-500/10 border-2 text-gray-400": !time.isActive,
                    }
                  )}
                  onClick={() => {
                    handleSessionClick(setFirstSession, index);
                  }}
                >
                  <FaClock />
                  <span className="pointer-events-none">
                    {time.start}
                  </span> -{" "}
                  <span className="pointer-events-none">{time.end}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-center font-semibold">Session 2</div>
            <div className="flex flex-col gap-2">
              {secondSession.map((time, index) => (
                <div
                  key={`second-time-slots-${index + 1}`}
                  className={cn(
                    "px-4 rounded-full cursor-pointer flex gap-2 items-center",
                    {
                      "border-black border-2 text-black": time.isActive,
                      "bg-gray-500/10 border-2 text-gray-400": !time.isActive,
                    }
                  )}
                  onClick={() => {
                    handleSessionClick(setSecondSession, index);
                  }}
                >
                  <FaClock />
                  <span className="pointer-events-none">
                    {time.start}
                  </span> -{" "}
                  <span className="pointer-events-none">{time.end}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-center font-semibold">Session 3</div>
            <div className="flex flex-col gap-2">
              {thirdSession.map((time, index) => (
                <div
                  key={`third-time-slots-${index + 1}`}
                  className={cn(
                    "px-4 rounded-full cursor-pointer flex gap-2 items-center",
                    {
                      "border-black border-2 text-black": time.isActive,
                      "bg-gray-500/10 border-2 text-gray-400": !time.isActive,
                    }
                  )}
                  onClick={() => {
                    handleSessionClick(setThirdSession, index);
                  }}
                >
                  <FaClock />
                  <span className="pointer-events-none ">
                    {time.start}
                  </span> -{" "}
                  <span className="pointer-events-none">{time.end}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="ribbon bg-gray-300 text-black">Time Schedules</div>
      </div>
      <div className="flex-auto flex flex-col gap-2">
        <div className="border border-dashed border-black bg-white rounded-xl shadow-md p-6 mb-4 relative">
          <p className="">
            Click on the time slots to select/remove from the schedule. You can
            also use following buttons to select/deselect items in the list.
          </p>
          <FaArrowLeft className="absolute top-1/2 w-6 h-6 left-0 -translate-x-3/4 -translate-y-1/2" />
          <FaArrowDown className="absolute bottom-0 w-6 h-6 left-1/2 -translate-x-2/4 translate-y-3/4" />
        </div>

        <Button
          disabled={isDisabled}
          onClick={() => {
            if (isDisabled) return;
            setFirstSession((prev) =>
              prev.map((item) => ({ ...item, isActive: true }))
            );
            setSecondSession((prev) =>
              prev.map((item) => ({ ...item, isActive: true }))
            );
            setThirdSession((prev) =>
              prev.map((item) => ({ ...item, isActive: true }))
            );
          }}
        >
          Select All Sessions
        </Button>
        <Button
          disabled={isDisabled}
          onClick={() => {
            if (isDisabled) return;
            setFirstSession((prev) =>
              prev.map((item) => ({ ...item, isActive: true }))
            );
          }}
        >
          Select All Of Session 1
        </Button>
        <Button
          disabled={isDisabled}
          onClick={() => {
            if (isDisabled) return;
            setSecondSession((prev) =>
              prev.map((item) => ({ ...item, isActive: true }))
            );
          }}
        >
          Select All Of Session 2
        </Button>
        <Button
          disabled={isDisabled}
          onClick={() => {
            if (isDisabled) return;
            setThirdSession((prev) =>
              prev.map((item) => ({ ...item, isActive: true }))
            );
          }}
        >
          Select All Of Session 3
        </Button>
        <Button
          disabled={isDisabled}
          variant="outline"
          className="border-black border-2"
          onClick={() => {
            if (isDisabled) return;
            setFirstSession(first);
            setSecondSession(second);
            setThirdSession(third);
          }}
        >
          Deselect All Sessions
        </Button>
        <Button
          disabled={isDisabled}
          variant="outline"
          className="border-black border-2"
          onClick={() => {
            if (isDisabled) return;
            setFirstSession((prev) =>
              prev.map((item) => ({ ...item, isActive: false }))
            );
          }}
        >
          Deselect All Of Session 1
        </Button>
        <Button
          disabled={isDisabled}
          variant="outline"
          className="border-black border-2"
          onClick={() => {
            if (isDisabled) return;
            setSecondSession((prev) =>
              prev.map((item) => ({ ...item, isActive: false }))
            );
          }}
        >
          Deselect All Of Session 2
        </Button>
        <Button
          disabled={isDisabled}
          variant="outline"
          className="border-black border-2"
          onClick={() => {
            if (isDisabled) return;
            setThirdSession((prev) =>
              prev.map((item) => ({ ...item, isActive: false }))
            );
          }}
        >
          Deselect All Of Session 3
        </Button>
      </div>
    </div>
  );
};

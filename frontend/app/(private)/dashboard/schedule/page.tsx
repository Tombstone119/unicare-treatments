"use client";

import { ScheduleCalendar } from "@/channeling/widgets/schedule-calendar";
import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

export default function Page() {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <div className=" bg-white py-5 px-10 min-h-svh">
      <div className="flex flex-col gap-1 justify-center items-center w-full">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaCalendarAlt /> Time Slot Management
        </h1>
        <ScheduleCalendar date={date} setDate={setDate} />
      </div>
    </div>
  );
}

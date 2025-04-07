import React, { Dispatch, SetStateAction, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { Calendar } from "@/shadcn/ui/calendar";

const allowedDates = [
  new Date("2023-01-01"),
  new Date("2023-01-15"),
  new Date("2025-04-16"),
  new Date("2025-03-01"),
  new Date("2025-03-10"),
  new Date("2025-03-20"),
  new Date("2025-04-01"),
  new Date("2025-05-05"),
];

// const disableDatesInRange = (date: Date) => {
//   // Example: Disable all dates before today
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   // Example: Disable dates in a specific range
//   const rangeStart = new Date("2025-04-10");
//   const rangeEnd = new Date("2025-04-20");

//   return date < today || (date >= rangeStart && date <= rangeEnd);
// };

export const FlipCalendar = ({
  date,
  setDate,
}: {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
}) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const isDateAllowed = (date: Date) => {
    return allowedDates.some(
      (allowedDate) => allowedDate.toDateString() === date.toDateString()
    );
  };

  const handleSelectDate = (selectedDate: { date: Date }) => {
    setDate(selectedDate.date);
    setIndex((pv) => pv + 1);
  };

  return (
    <div className="relative flex items-center text-indigo-950 gap-5">
      <CalendarDisplay
        index={index}
        date={date}
        visible={visible}
        setVisible={setVisible}
      />
      <AnimatePresence>
        {visible && (
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate: Date | undefined) => {
              if (selectedDate && isDateAllowed(selectedDate)) {
                // setDate(selectedDate);
                handleSelectDate({ date: selectedDate });
              }
            }}
            disabled={(day) => !isDateAllowed(day)}
            className="w-[280px] rounded-md shadow-md p-2 border-black border-2"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const CalendarDisplay = ({
  index,
  date,
  visible,
  setVisible,
}: CalendarDisplayProps) => {
  return (
    <div className="w-fit overflow-hidden rounded-xl border-2 border-black bg-black flex-none">
      <div className="flex items-center justify-between px-1.5 py-0.5">
        <span className="text-center uppercase text-white">
          {format(date, "LLLL")}
        </span>
        <button
          onClick={() => setVisible((pv) => !pv)}
          className="text-white transition-colors hover:text-indigo-200"
        >
          {visible ? <FiArrowLeft /> : <FiEdit />}
        </button>
      </div>
      <div className="relative z-0 h-36 w-52 shrink-0 ">
        <AnimatePresence mode="sync">
          <motion.div
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
              zIndex: -index,
              backfaceVisibility: "hidden",
            }}
            key={index}
            transition={{
              duration: 0.75,
              ease: "easeInOut",
            }}
            initial={{ rotateX: "0deg" }}
            animate={{ rotateX: "0deg" }}
            exit={{ rotateX: "-180deg" }}
            className="absolute inset-0"
          >
            <div className="grid h-full w-full place-content-center rounded-lg bg-white text-6xl">
              {format(date, "do")}
            </div>
          </motion.div>
          <motion.div
            style={{
              clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
              zIndex: index,
              backfaceVisibility: "hidden",
            }}
            key={(index + 1) * 2}
            initial={{ rotateX: "180deg" }}
            animate={{ rotateX: "0deg" }}
            exit={{ rotateX: "0deg" }}
            transition={{
              duration: 0.75,
              ease: "easeInOut",
            }}
            className="absolute inset-0"
          >
            <div className="relative grid h-full w-full place-content-center rounded-lg bg-white text-6xl">
              {format(date, "do")}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs">
                {format(date, "yyyy")}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

interface CalendarDisplayProps {
  index: number;
  date: Date;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

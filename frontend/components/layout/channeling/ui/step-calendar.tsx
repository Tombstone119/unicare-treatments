import { ArrowLeft } from "lucide-react";
import { FlipCalendar } from "@/channeling/widgets/flip-calendar";
import { Dispatch, SetStateAction } from "react";
import { FaCalendarAlt } from "react-icons/fa";

export default function FirstStep({
  handleSetStep,
  date,
  setDate,
}: {
  handleSetStep: (num: -1 | 1) => void;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
}) {
  return (
    <div className="flex flex-col min-h-[488px] items-center justify-center gap-10">
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Select a Date
      </h1>
      <FlipCalendar date={date} setDate={setDate} />
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

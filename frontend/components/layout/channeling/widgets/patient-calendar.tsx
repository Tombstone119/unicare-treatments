import { cn } from "@/libs/utils";
import { Sessions } from "@/types/channeling";
import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { IoTime } from "react-icons/io5";
import { MdOutlineBlock, MdOutlineCircle } from "react-icons/md";

type SessionType = "first" | "second" | "third" | undefined;
type SetSessionActions = Dispatch<SetStateAction<SessionType>>;

const PatientCalender = ({
  date,
  sessions,
  selectedSession,
  setSelectedSession,
}: {
  date: Date | null;
  selectedSession?: SessionType;
  setSelectedSession: SetSessionActions;
  sessions: {
    firstSession?: Sessions;
    secondSession?: Sessions;
    thirdSession?: Sessions;
  };
}) => {
  return (
    <div className="flex flex-col rounded-xl border-2 border-black bg-black flex-none min-w-[250px] min-h-[330px]">
      {date && (
        <div className="flex justify-center items-center gap-1 px-1.5 py-0.5 uppercase text-white text-center">
          <span>{date && format(date, "do")}</span>
          <span>{date && format(date, "LLLL")}</span>
          <span>{date && format(date, "yyyy")}</span>
        </div>
      )}
      {date ? (
        <div className="bg-white py-2 px-4 text-black rounded-xl flex-auto">
          <div className="font-bold flex items-center gap-2 pb-1 mb-1">
            <IoTime />
            Available Times
          </div>
          {SessionDetails({
            sessionName: "First Session",
            selectedSession: selectedSession === "first",
            sessions: sessions?.firstSession,
            setSessions: () => {
              setSelectedSession("first");
            },
          })}
          {SessionDetails({
            sessionName: "Second Session",
            selectedSession: selectedSession === "second",
            sessions: sessions?.secondSession,
            setSessions: () => {
              setSelectedSession("second");
            },
          })}
          {SessionDetails({
            sessionName: "Third Session",
            selectedSession: selectedSession === "third",
            sessions: sessions?.thirdSession,
            setSessions: () => {
              setSelectedSession("third");
            },
          })}
        </div>
      ) : (
        <div className="bg-white p-5 text-black rounded-xl flex-auto flex items-center justify-center">
          Please Select a Date First
        </div>
      )}
    </div>
  );
};

export default PatientCalender;

const SessionDetails = ({
  sessionName,
  selectedSession,
  sessions,
  setSessions,
}: {
  sessionName: string;
  selectedSession: boolean;
  sessions?: Sessions;
  setSessions: () => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      {sessions ? (
        <div
          className={cn(
            "mb-2 relative cursor-pointer px-2 py-3 border-2 rounded-md",
            selectedSession && "border-green-600 bg-green-600/10"
          )}
          onClick={setSessions}
        >
          <div className="flex items-center gap-2 font-semibold">
            {selectedSession ? (
              <FiCheckCircle className="text-green-900" />
            ) : (
              <MdOutlineCircle />
            )}
            <span>{sessionName}</span>
          </div>
          <div className="pl-6 text-sm flex flex-col pointer-events-none">
            <div>
              Number: <span className="font-bold">{sessions?.number}</span>
            </div>
            <div>
              Time Slot:{" "}
              <span className="rounded-full py-1 px-2 bg-green-900 text-white font-bold">
                {sessions?.start} - {sessions?.end}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-2 opacity-40 px-2 py-3 border-2 rounded-md w-full">
          <div className="flex items-center gap-2 font-semibold">
            <MdOutlineBlock />
            <span>{sessionName}</span>
          </div>
          <div className="pl-6 text-sm">
            <div>Number: Full</div>
          </div>
        </div>
      )}
    </div>
  );
};

import { cn } from "@/libs/utils";
import { Button } from "@/shadcn/ui/button";
import { TimeSlot } from "@/types/users";
import { FaClock, FaUserClock } from "react-icons/fa";

export default function SessionCol({
  sessionTitle,
  session,
  clickHandler,
  children,
  count,
  blockFirst,
  blockedEnd,
  onSelect,
  isDisabled,
}: {
  sessionTitle: string;
  session: TimeSlot[];
  clickHandler: (index: number) => void;
  children?: React.ReactNode;
  count: number;
  blockFirst?: React.ReactNode;
  blockedEnd?: React.ReactNode;
  onSelect?: (active: boolean) => void;
  isDisabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-center">
        {sessionTitle} {count}
      </div>
      <div className="grid grid-cols-2 gap-2 justify-center ">
        <Button
          disabled={isDisabled}
          variant="outline"
          className="border-black border-2"
          onClick={() => onSelect && onSelect(false)}
        >
          Deselect All
        </Button>
        <Button
          disabled={isDisabled}
          onClick={() => onSelect && onSelect(true)}
        >
          Select All
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {blockFirst}
        {session.map((time, index) => (
          <div
            key={`first-time-slots-${index + 1}`}
            className={cn(
              "px-2 rounded-full cursor-pointer flex gap-2 items-center justify-center",
              {
                "border-black border-2 text-black": time.isActive,
                "bg-gray-500/10 border-2 text-gray-400": !time.isActive,
                "bg-red-500/10 text-red-600 border-red-500 cursor-not-allowed":
                  time.appointmentId,
              }
            )}
            onClick={() => {
              if (time.appointmentId) return;
              clickHandler(index);
            }}
          >
            {time.appointmentId ? (
              <FaUserClock className="text-red-600" />
            ) : (
              <FaClock />
            )}
            <span className="pointer-events-none">{time.start}</span> -{" "}
            <span className="pointer-events-none">{time.end}</span>
          </div>
        ))}
        {blockedEnd}
      </div>
      {children}
    </div>
  );
}

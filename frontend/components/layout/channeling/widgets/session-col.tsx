import { cn } from "@/libs/utils";
import { TimeSlot } from "@/types/users";
import { FaClock } from "react-icons/fa";

export default function SessionCol({
  sessionTitle,
  session,
  clickHandler,
  children,
  count,
  blockFirst,
  blockedEnd,
}: {
  sessionTitle: string;
  session: TimeSlot[];
  clickHandler: (index: number) => void;
  children?: React.ReactNode;
  count: number;
  blockFirst?: React.ReactNode;
  blockedEnd?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-center">
        {sessionTitle} {count}
      </div>
      <div className="flex flex-col gap-3">
        {blockFirst}
        {session.map((time, index) => (
          <div
            key={`first-time-slots-${index + 1}`}
            className={cn(
              "px-2 rounded-full cursor-pointer flex gap-2 items-center",
              {
                "border-black border-2 text-black": time.isActive,
                "bg-gray-500/10 border-2 text-gray-400": !time.isActive,
              }
            )}
            onClick={() => clickHandler(index)}
          >
            <FaClock />
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

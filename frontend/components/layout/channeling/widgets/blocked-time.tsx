import { ImBlocked } from "react-icons/im";

export default function BlockedTime({
  start,
  end,
}: {
  start: string;
  end: string;
}) {
  return (
    <div className="cursor-not-allowed text-red-500 px-2 rounded-full flex gap-2 items-center border-red-500 border-2">
      <ImBlocked />
      <span className="pointer-events-none">{start}</span> -{" "}
      <span className="pointer-events-none">{end}</span>
    </div>
  );
}

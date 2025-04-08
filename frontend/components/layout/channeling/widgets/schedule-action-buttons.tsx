import { first, second, third } from "@/helpers/data/time.data";
import { Button } from "@/shadcn/ui/button";
import { TimeSlot } from "@/types/users";

export default function ScheduleActionButtons({
  isDisabled,
  setFirstSession,
  setSecondSession,
  setThirdSession,
}: {
  isDisabled: boolean;
  setFirstSession: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
  setSecondSession: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
  setThirdSession: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
}) {
  return (
    <>
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
    </>
  );
}

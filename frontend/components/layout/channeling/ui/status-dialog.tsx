"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shadcn/ui/alert-dialog";
import { Button } from "@/shadcn/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiService } from "@/libs/api";
import { IAppointment } from "@/types/appointment";
import { TApiResponse } from "@/types/common";
import { FaExpeditedssl } from "react-icons/fa";
import { cn } from "@/libs/utils";
import {
  appointmentStatusObj,
  TAppointmentStatus,
} from "@/helpers/data/status.button.data";

const StatusDialog = ({
  rowData,
  refreshFn,
}: {
  rowData: IAppointment;
  refreshFn: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TAppointmentStatus>("waiting");

  const submitHandler = async () => {
    try {
      const res = await apiService.put<TApiResponse>(
        `/appointments/update-appointment-status/${rowData.referenceNumber}`,
        {
          appointmentStatus: selected,
        }
      );
      if (!res.success) {
        toast.error("Error changing appointment. Please try again later.");
      } else {
        toast.success("Appointment deleted successfully.");
        setOpen(false);
      }
    } catch {
      toast.error("Error changing appointment. Please try again later.");
    } finally {
      refreshFn();
    }
  };

  useEffect(() => {
    setSelected(rowData.appointmentStatus as keyof typeof appointmentStatusObj);
  }, [rowData.appointmentStatus, open]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-800">
          <FaExpeditedssl className="w-4 h-4" />
          Status
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[300px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Change Status
          </AlertDialogTitle>

          <div className="flex flex-col gap-2 items-center border-2 border-dashed border-black p-2">
            {Object.values(appointmentStatusObj).map((status) => (
              <div
                key={status.text}
                className={cn(
                  "cursor-pointer max-w-max px-2 py-1 border-2 rounded-md inline-flex items-center justify-center  gap-2 text-sm",
                  `${status.color}`,
                  selected === status.key ? "opacity-100" : "opacity-40"
                )}
                onClick={() => {
                  setSelected(status.key as TAppointmentStatus);
                }}
              >
                <status.icon className={cn(status.iconCss)} />
                {status.text}
              </div>
            ))}
          </div>
        </AlertDialogHeader>
        <div className="flex items-center justify-center gap-5">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            aria-disabled={false}
            className="w-auto bg-blue-600"
            onClick={submitHandler}
          >
            Save
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StatusDialog;

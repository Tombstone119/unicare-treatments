"use client";

import { Column, ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/channeling/elements/table-elements/sort-menu";

import { Dialog, DialogContent, DialogTrigger } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Pencil } from "lucide-react";
import CopyToClipboard from "@/channeling/widgets/copy-to-clipboard";
import { EditPass } from "@/channeling/ui/edit-pass";
import { IAppointment } from "@/types/appointment";
import { cn } from "@/libs/utils";
import { FaClock } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import Image from "next/image";
import { format, formatDistanceToNow, isToday, isTomorrow } from "date-fns";
import { BsCash } from "react-icons/bs";
import { SiCashapp } from "react-icons/si";

const paymentStatusObj = {
  pending: {
    text: "Pay Now",
    color: "bg-yellow-500/50 text-yellow-900 border-yellow-600",
    icon: SiCashapp,
  },
  completed: {
    text: "Payment Done",
    color: "bg-green-500/50 text-green-900 border-green-600",
    icon: FaCircleCheck,
  },
  cancelled: {
    text: "Cancelled",
    color: "bg-red-500/50 text-red-900 border-red-600",
    icon: IoIosCloseCircle,
  },
};

const appointmentStatusObj = {
  waiting: {
    text: "Waiting",
    color: "bg-white text-black border-black",
    icon: FaClock,
  },
  completed: {
    text: "Completed",
    color: "bg-white text-black border-black",
    icon: FaCircleCheck,
  },
  cancelled: {
    text: "Cancelled",
    color: "bg-red-500/50 text-red-900 border-red-600",
    icon: IoIosCloseCircle,
  },
};

export const getColumns = (
  refreshPage: () => void
  // getPaymentDone: (data: IAppointment) => void
): ColumnDef<IAppointment>[] => {
  const columns: ColumnDef<IAppointment>[] = [
    {
      accessorKey: "referenceNumber",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="REF" />
      ),
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex items-center gap-2">
            <CopyToClipboard
              value={rowData.referenceNumber || ""}
              text=""
            ></CopyToClipboard>
            <div className="border border-dashed py-2 px-2 border-black">
              {rowData.referenceNumber}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "channelingDate",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="DATE" />
      ),
      cell: ({ row }) => {
        const dob = row.getValue("channelingDate");
        if (!dob) {
          return <div className="text-gray-400">N/A</div>;
        }
        const formattedDate = format(new Date(`${dob}`), "yyyy / MM / dd");
        return <div>{`${formattedDate}`}</div>;
      },
    },

    {
      accessorKey: "TimeSlot",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="TimeSlot" />
      ),
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div>
            <div className="flex items-center gap-2 font-semibold text-blue-950">
              {`Session : `}
              <div className="rounded-full w-4 h-4 border border-black flex items-center justify-center">
                {rowData.sessionNumber}
              </div>
            </div>
            {`( ${rowData.startingTime} - ${rowData.endingTime} )`}
          </div>
        );
      },
    },
    {
      accessorKey: "paymentStatus",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="Payment" />
      ),
      cell: ({ row }) => {
        const obj =
          paymentStatusObj[
            row.getValue("paymentStatus") as keyof typeof paymentStatusObj
          ];
        const Icon = obj.icon;
        return (
          <div
            className={cn(
              "cursor-pointer px-2 py-1 border-2 rounded-md min-w-36 inline-flex items-center justify-center gap-2",
              `${obj.color}`
            )}
          >
            <Icon />
            {`${obj.text}`}
          </div>
        );
      },
    },
    {
      accessorKey: "doctorName",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="DOCTOR" />
      ),
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex items-center gap-2">
            <div className="rounded-full w-8 h-8 border border-black flex items-center justify-center relative overflow-hidden">
              <Image src="/assets/images/doctor.jpeg" alt="Doctor" fill />
            </div>
            {`${rowData.doctorName}`}
          </div>
        );
      },
    },
    {
      accessorKey: "paymentAmount",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="PAYMENT" />
      ),
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="border border-dashed py-2 px-2 border-black flex items-center gap-2">
            <BsCash className="w-6 h-6 text-gray-500" />
            {`Rs. ${rowData.paymentAmount ? rowData.paymentAmount : 0}`}
          </div>
        );
      },
    },
    {
      accessorKey: "appointmentStatus",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="APPOINTMENT" />
      ),
      cell: ({ row }) => {
        const obj =
          appointmentStatusObj[
            row.getValue(
              "appointmentStatus"
            ) as keyof typeof appointmentStatusObj
          ];
        const Icon = obj.icon;
        let relativeDate = "";
        const channelingDate = new Date(
          row.getValue("channelingDate") as string
        );
        if (obj.text === "Waiting") {
          if (isToday(channelingDate)) {
            relativeDate = "It's on Today";
          } else if (isTomorrow(channelingDate)) {
            relativeDate = "It's on Tomorrow";
          } else {
            relativeDate = `It's ${formatDistanceToNow(channelingDate, {
              addSuffix: true,
            })}`;
          }
        }
        return (
          <div
            className={cn(
              "px-2 py-1 border-2 rounded-md min-w-32 inline-flex items-center justify-center  gap-2",
              `${obj.color}`
            )}
          >
            <Icon />
            {`${obj.text === "Waiting" ? relativeDate : obj.text}`}
          </div>
        );
      },
    },

    {
      id: "actions",
      accessorKey: "actions",
      header: () => <div className="text-white">ACTIONS</div>,
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex align-items justify-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-800">
                  <Pencil className="w-4 h-4" />
                  Change/Refund
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <EditPass rowData={rowData} refreshFn={refreshPage} />
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },

    // {
    //   accessorKey: "email",
    //   header: ({ column }: { column: Column<IAppointment, unknown> }) => (
    //     <DataTableColumnHeader column={column} title="EMAIL" />
    //   ),
    // },
    // {
    //   accessorKey: "phoneNumber",
    //   header: ({ column }: { column: Column<IAppointment, unknown> }) => (
    //     <DataTableColumnHeader column={column} title="CONTACT" />
    //   ),
    // },

    // {
    //   accessorKey: "fullName",
    //   header: ({ column }: { column: Column<IAppointment, unknown> }) => (
    //     <DataTableColumnHeader column={column} title="NAME" />
    //   ),
    //   accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    // },
  ];

  return columns;
};

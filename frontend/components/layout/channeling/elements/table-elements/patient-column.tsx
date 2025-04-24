"use client";

import { Column, ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/channeling/elements/table-elements/sort-menu";

import CopyToClipboard from "@/channeling/widgets/copy-to-clipboard";
import { IAppointment } from "@/types/appointment";
import { cn } from "@/libs/utils";
import Image from "next/image";
import {
  format,
  formatDistanceToNow,
  isBefore,
  isToday,
  isTomorrow,
  startOfToday,
} from "date-fns";
import { BsCash } from "react-icons/bs";
import Link from "next/link";
import {
  appointmentStatusObj,
  paymentStatusObj,
  TAppointmentStatus,
  TPaymentStatus,
} from "@/helpers/data/status.button.data";

const isBeforeToday = (date: Date): boolean => {
  return isBefore(date, startOfToday());
};

export const getColumns = (userId: string): ColumnDef<IAppointment>[] => {
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
        return <div className="min-w-max">{`${formattedDate}`}</div>;
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
            <div className="flex items-center gap-2 font-semibold text-blue-950 min-w-max">
              {`Session : `}
              <div className="rounded-full w-4 h-4 border border-black flex items-center justify-center">
                {rowData.sessionNumber}
              </div>
            </div>
            <div className="min-w-max">{`( ${rowData.startingTime} - ${rowData.endingTime} )`}</div>
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
          paymentStatusObj[row.getValue("paymentStatus") as TPaymentStatus];
        const Icon = obj.icon;
        if (obj.key === "pending") {
          return (
            <Link
              href={`/appointment-payment?appointmentId=${row.getValue(
                "referenceNumber"
              )}&userId=${userId}`}
            >
              <div
                className={cn(
                  "cursor-pointer px-2 py-1 border-2 rounded-md min-w-36 inline-flex items-center justify-center gap-2",
                  `${obj.color}`
                )}
              >
                <Icon className={cn(obj.iconCss)} />
                {`${obj.secondaryText}`}
              </div>
            </Link>
          );
        }
        return (
          <div
            className={cn(
              "cursor-pointer px-2 py-1 border-2 rounded-md min-w-36 inline-flex items-center justify-center gap-2",
              `${obj.color}`
            )}
          >
            <Icon className={cn(obj.iconCss)} />
            {`${obj.secondaryText}`}
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
            <div className="flex-none rounded-full w-8 h-8 border border-black flex items-center justify-center relative overflow-hidden">
              <Image src="/assets/images/doctor.jpeg" alt="Doctor" fill />
            </div>
            {`Dr.${rowData.doctorName}`}
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
            row.getValue("appointmentStatus") as TAppointmentStatus
          ];
        const Icon = obj.icon;
        let relativeDate = "";
        const channelingDate = new Date(
          row.getValue("channelingDate") as string
        );
        if (obj.key === "waiting") {
          if (isToday(channelingDate)) {
            relativeDate = "It's on Today";
          } else if (isTomorrow(channelingDate)) {
            relativeDate = "It's on Tomorrow";
          } else if (isBeforeToday(channelingDate)) {
            relativeDate = `No Show`;
          } else {
            relativeDate = `It's ${formatDistanceToNow(channelingDate, {
              addSuffix: true,
            })}`;
          }
        }
        return (
          <div
            className={cn(
              "px-2 py-1 border-2 rounded-md min-w-max inline-flex items-center justify-center  gap-2 text-sm",
              relativeDate === `No Show`
                ? "bg-red-500/30 text-red-900 border-red-600"
                : `${obj.color}`
            )}
          >
            <Icon className={cn(obj.iconCss)} />
            {`${obj.text === "Waiting" ? relativeDate : obj.text}`}
          </div>
        );
      },
    },
  ];

  return columns;
};

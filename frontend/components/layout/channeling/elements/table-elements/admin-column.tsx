"use client";

import { Column, ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/channeling/elements/table-elements/sort-menu";

import { Dialog, DialogContent, DialogTrigger } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Loader2, Pencil } from "lucide-react";
import CopyToClipboard from "@/channeling/widgets/copy-to-clipboard";
import { EditPass } from "@/channeling/ui/edit-pass";
import { IAppointment } from "@/types/appointment";
import { cn } from "@/libs/utils";
import Image from "next/image";
import { format } from "date-fns";
import { BsCash } from "react-icons/bs";
import DeleteDialog from "@/channeling/ui/delete-dialog";
import StatusDialog from "@/channeling/ui/status-dialog";
import {
  appointmentStatusObj,
  paymentStatusObj,
  TAppointmentStatus,
  TPaymentStatus,
} from "@/helpers/data/status.button.data";
import PaymentDialog from "@/channeling/ui/payment-dialog";

export const getColumns = (
  refreshPage: () => void,
  sendPaymentNotification: (
    appointmentId: string,
    email: string,
    userId: string
  ) => void,
  loading: {
    ref: string;
    item: string;
  }
): ColumnDef<IAppointment>[] => {
  const columns: ColumnDef<IAppointment>[] = [
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
                  Session
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <EditPass rowData={rowData} refreshFn={refreshPage} />
              </DialogContent>
            </Dialog>
            <DeleteDialog rowData={rowData} refreshFn={refreshPage} />
            <StatusDialog rowData={rowData} refreshFn={refreshPage} />
            <PaymentDialog rowData={rowData} refreshFn={refreshPage} />
          </div>
        );
      },
    },
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
        const channelingDate = row.getValue("channelingDate");
        if (!channelingDate) {
          return <div className="text-gray-400">N/A</div>;
        }
        const formattedDate = format(
          new Date(`${channelingDate}`),
          "yyyy / MM / dd"
        );
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
        return (
          <div
            className={cn(
              "px-2 py-1 border-2 rounded-md min-w-max inline-flex items-center justify-center  gap-2 text-sm",
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
            <div className="flex-none rounded-full w-8 h-8 border border-black flex items-center justify-center relative overflow-hidden">
              <Image src="/assets/images/doctor.jpeg" alt="Doctor" fill />
            </div>
            {`Dr. ${rowData.doctorName}`}
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
            <div
              className={cn(
                "cursor-pointer px-2 py-1 border-2 rounded-md min-w-36 inline-flex items-center justify-center gap-2",
                `${obj.color}`
              )}
              onClick={() => {
                sendPaymentNotification(
                  row.getValue("referenceNumber"),
                  row.getValue("email"),
                  row.getValue("patientId")
                );
              }}
            >
              <Icon />
              {`${obj.text}`}
              {loading.ref === row.getValue("referenceNumber") &&
                loading.item === "payment" && (
                  <Loader2 className="animate-spin w-4 h-4" />
                )}
            </div>
          );
        }
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
      accessorKey: "paymentId",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="PAYMENT ID" />
      ),
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex items-center gap-2">
            <CopyToClipboard
              value={rowData.paymentId || "N/A"}
              text=""
            ></CopyToClipboard>
            <div className="border border-dashed py-2 px-2 border-black">
              {rowData.paymentId ? rowData.paymentId : "N/A"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "fullName",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="NAME" />
      ),
      // accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex items-center gap-2">
            <div className="flex-none rounded-full w-8 h-8 border border-black bg-black/20 text-black flex items-center justify-center relative overflow-hidden">
              {/* <Image src="/assets/images/doctor.jpeg" alt="Doctor" fill /> */}
              <span> {`${rowData.firstName} `.split("")[0]}</span>
            </div>
            {`${rowData.firstName} ${rowData.lastName}`}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="EMAIL" />
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="CONTACT" />
      ),
    },

    {
      accessorKey: "patientId",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="PATIENT ID" />
      ),
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex items-center gap-2">
            <CopyToClipboard
              value={
                rowData.patientId
                  ? rowData.patientId
                  : rowData.paymentStatus === "completed"
                    ? "Cash"
                    : "N/A"
              }
              text=""
            ></CopyToClipboard>
            <div className="border border-dashed py-2 px-2 border-black">
              {rowData.patientId
                ? rowData.patientId
                : rowData.paymentStatus === "completed"
                  ? "Cash"
                  : "N/A"}
            </div>
          </div>
        );
      },
    },
  ];

  return columns;
};

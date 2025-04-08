"use client";

import { Column, ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/channeling/elements/table-elements/sort-menu";

import { IAppointment } from "@/types/index";
import { Dialog, DialogContent, DialogTrigger } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Pencil } from "lucide-react";
import DeleteDialog from "@/channeling/ui/delete-dialog";
import CopyToClipboard from "@/channeling/widgets/copy-to-clipboard";
import { EditPass } from "@/channeling/ui/edit-pass";

export const getColumns = (
  refreshPage: () => void
  // getPaymentDone: (data: IAppointment) => void
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
            <CopyToClipboard
              value={rowData.referenceNumber || ""}
            ></CopyToClipboard>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-800">
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <EditPass rowData={rowData} refreshFn={refreshPage} />
              </DialogContent>
            </Dialog>
            <DeleteDialog rowData={rowData} refreshFn={refreshPage} />
            {/* <Button onClick={() => getPaymentDone(rowData)}>Pay Now</Button> */}
          </div>
        );
      },
    },
    {
      accessorKey: "referenceNumber",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="REF" />
      ),
    },

    {
      accessorKey: "appointmentDate",
      header: ({ column }: { column: Column<IAppointment, unknown> }) => (
        <DataTableColumnHeader column={column} title="APPOINTMENT" />
      ),
      cell: ({ row }) => {
        const dob = row.getValue("appointmentDate");
        const date = new Date(`${dob}`);
        return (
          <div>{`${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`}</div>
        );
      },
    },

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

"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import { useState } from "react";
import { DataTablePagination } from "@/channeling/elements/table-elements/pagination";
import { DataTableViewOptions } from "@/channeling/elements/table-elements/view-options";

import { Input } from "@/shadcn/ui/input";
import { cn } from "@/libs/utils";
import { FaFile, FaUser } from "react-icons/fa";
import { BsCash } from "react-icons/bs";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  children?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  children,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    details: false,
    modified: false,
    id: false,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [selectedFilter, setSelectedFilter] = useState<
    "referenceNumber" | "paymentId" | "patientId"
  >("referenceNumber");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const getFilterValue = () => {
    const column = table.getColumn(selectedFilter);
    return (column?.getFilterValue() as string) ?? "";
  };

  const filterStyles = {
    referenceNumber: "border-red-500",
    patientId: "border-green-500",
    paymentId: "border-blue-500",
  };

  const filterOptions = [
    {
      id: "referenceNumber",
      icon: <FaFile className="w-4 h-4" />,
      activeClasses: "bg-red-200 border-red-500 text-red-500",
    },
    {
      id: "patientId",
      icon: <FaUser className="w-4 h-4" />,
      activeClasses: "bg-green-200 border-green-500 text-green-500",
    },
    {
      id: "paymentId",
      icon: <BsCash className="w-4 h-4" />,
      activeClasses: "bg-blue-200 border-blue-500 text-blue-500",
    },
  ];

  return (
    <>
      <div className="flex items-center pb-4 gap-2 w-full justify-between">
        <div className="flex items-center gap-3">
          {children} <DataTableViewOptions table={table} />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {filterOptions.map((option) => (
              <div
                key={option.id}
                className={cn(
                  "border-2 border-gray-300 text-gray-300 rounded-md p-1 cursor-pointer",
                  {
                    [option.activeClasses]: selectedFilter === option.id,
                  }
                )}
                onClick={() =>
                  setSelectedFilter(option.id as keyof typeof filterStyles)
                }
              >
                {option.icon}
              </div>
            ))}
          </div>
          <Input
            placeholder={
              selectedFilter === "paymentId"
                ? "Search by Payment ID"
                : selectedFilter === "patientId"
                  ? "Search by Patient ID"
                  : "Search by Ref"
            }
            value={getFilterValue()}
            onChange={(event) => {
              const value = event.target.value;
              table.getColumn(selectedFilter)?.setFilterValue(value);
            }}
            className={cn(
              "max-w-sm border-2 !ring-0 min-w-[200px]",
              filterStyles[selectedFilter]
            )}
          />
        </div>
      </div>
      <div className="w-full rounded-md border">
        <Table
          className={cn(
            table.getRowModel().rows?.length === 0 && "min-h-[400px]",
            "flex-auto"
          )}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-black hover:bg-black"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="bg-white hover:bg-gray-100/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-10">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="bg-white hover:bg-white">
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-full"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </>
  );
}

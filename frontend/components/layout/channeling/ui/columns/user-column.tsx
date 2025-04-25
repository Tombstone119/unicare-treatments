"use client";

import { Column, ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/channeling/elements/table-elements/sort-menu";

import { IUser } from "@/types/users";

export const getColumns = (): ColumnDef<IUser>[] => {
  const columns: ColumnDef<IUser>[] = [
    {
      accessorKey: "_id",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "username",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="USERNAME" />
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="EMAIL" />
      ),
    },
    {
      accessorKey: "isVerified",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="IS VERIFIED" />
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="ROLE" />
      ),
    },
    {
      accessorKey: "firstName",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="FIRST NAME" />
      ),
    },
    {
      accessorKey: "lastName",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="LAST NAME" />
      ),
    },
    {
      accessorKey: "dateOfBirth",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="DOB" />
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="PHONE" />
      ),
    },
    {
      accessorKey: "address",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="ADDRESS" />
      ),
    },
    {
      accessorKey: "maritalState",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="MARITAL STATE" />
      ),
    },
    {
      accessorKey: "gender",
      header: ({ column }: { column: Column<IUser, unknown> }) => (
        <DataTableColumnHeader column={column} title="GENDER" />
      ),
    },
  ];

  return columns;
};

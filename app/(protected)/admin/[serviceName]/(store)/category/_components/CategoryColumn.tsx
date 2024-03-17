"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";

export interface CategoryColumn {
  id: string;
  name: string;
  createdAt: string;
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    minSize: 300,
    maxSize: 500,
    header: "이름",
  },
  {
    accessorKey: "createdAt",
    minSize: 150,
    maxSize: 300,
    header: "생성날짜",
  },
  {
    id: "actions",
    minSize: 50,
    maxSize: 50,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

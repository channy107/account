"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";

export interface BrandColumn {
  id: string;
  name: string;
  createdAt: string;
}

export const columns: ColumnDef<BrandColumn>[] = [
  {
    accessorKey: "name",
    minSize: 300,
    maxSize: 500,
    header: "이름",
  },
  {
    accessorKey: "createdAt",
    minSize: 350,
    maxSize: 500,
    header: "생성날짜",
  },
  {
    id: "actions",
    size: 50,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";
import ColorCell from "./ColorCell";

export interface ColorColumn {
  id: string;
  name: string;
  value: string;
  createdAt: string;
}

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    minSize: 300,
    maxSize: 500,
    header: "이름",
  },
  {
    accessorKey: "value",
    minSize: 300,
    maxSize: 500,
    header: "값",
    cell: ({ row }) => <ColorCell value={row.original.value} />,
  },
  {
    accessorKey: "createdAt",
    minSize: 150,
    maxSize: 300,
    header: "생성날짜",
  },
  {
    id: "actions",
    size: 50,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

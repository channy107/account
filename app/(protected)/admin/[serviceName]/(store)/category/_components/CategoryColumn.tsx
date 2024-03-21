"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";
import { TSelectStoreCategory } from "@/db/schema";

export interface CategoryColumn {
  id: string;
  smallCategory: string;
  mediumCategory?: string;
  largeCategory?: string;
  createdAt: string;
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "smallCategory",
    minSize: 300,
    maxSize: 500,
    header: "카테고리",
  },
  {
    accessorKey: "mediumCategory",
    minSize: 150,
    maxSize: 400,
    header: "중분류",
  },
  {
    accessorKey: "largeCategory",
    minSize: 150,
    maxSize: 400,
    header: "상분류",
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

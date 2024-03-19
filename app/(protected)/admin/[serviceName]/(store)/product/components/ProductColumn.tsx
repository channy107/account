"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  isSale: boolean | null;
  saleRate: number | null;
  images: string[];
  size: string;
  category: string;
  color: string;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "이름",
  },
  {
    accessorKey: "brand",
    header: "브랜드",
  },
  {
    accessorKey: "isSale",
    header: "할인여부",
  },
  {
    accessorKey: "saleRate",
    header: "할인율",
  },
  {
    accessorKey: "category",
    header: "카테고리",
  },
  {
    accessorKey: "size",
    header: "사이즈",
  },
  {
    accessorKey: "color",
    header: "색상",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.color }}
        />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

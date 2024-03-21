"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  brand: string;
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
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    size: 50,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

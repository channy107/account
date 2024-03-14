"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";
import AvatarCell from "./AvatarCell";
import RoleCell from "./RoleCell";

export interface UserColumn {
  id: string;
  name: string;
  email: string;
  role: string;
  type: string;
  image: string;
  createdAt: string;
}

export const columns: ColumnDef<UserColumn>[] = [
  {
    accessorKey: "name",
    header: "이름",
    cell: ({ row }) => <AvatarCell data={row.original} />,
  },
  {
    accessorKey: "email",
    header: "이메일",
  },
  {
    accessorKey: "role",
    header: "역할",
    cell: ({ row }) => <RoleCell role={row.original.role} />,
  },
  {
    accessorKey: "type",
    header: "유저 타입",
  },
  {
    accessorKey: "createdAt",
    header: "가입날짜",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

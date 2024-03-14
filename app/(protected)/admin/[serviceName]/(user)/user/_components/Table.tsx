"use client";

import Heading from "@/components/admin/Heading";
import DataTable from "@/components/admin/DataTable";
import { UserColumn, columns } from "./UserColumn";

interface Props {
  data: UserColumn[];
}

const UserTable = ({ data }: Props) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`유저 목록 (${data.length})`} />
      </div>
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
};

export default UserTable;

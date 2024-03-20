"use client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import Heading from "@/components/admin/Heading";
import DataTable from "@/components/admin/DataTable";
import { ColorColumn, columns } from "./ColorColumn";
import { Button } from "@/components/ui/button";
import { ADMIN_STORE_ROUTES } from "@/routes";

interface Props {
  data: ColorColumn[];
}

const ColorTable = ({ data }: Props) => {
  const router = useRouter();
  const params = useParams<{ serviceName: string }>();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`색상 목록 (${data.length})`} />
        <Button onClick={() => router.push(`${ADMIN_STORE_ROUTES.ADD_COLOR}`)}>
          <Plus className="mr-2 h-4 w-4" />
          만들기
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
};

export default ColorTable;

"use client";

import { Button } from "@/components/ui/button";

import { Separator } from "@radix-ui/react-separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ProductColumn, columns } from "./ProductColumn";
import Heading from "@/components/admin/Heading";
import DataTable from "@/components/admin/DataTable";
import { ADMIN_STORE_ROUTES } from "@/routes";

interface ProductClientProps {
  data: ProductColumn[];
}

const ProductTable = ({ data }: ProductClientProps) => {
  const router = useRouter();
  const params = useParams<{ serviceName: string }>();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`상품 목록 (${data.length})`} />
        <Button
          onClick={() => router.push(`${ADMIN_STORE_ROUTES.ADD_PRODUCT}`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          만들기
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
};

export default ProductTable;

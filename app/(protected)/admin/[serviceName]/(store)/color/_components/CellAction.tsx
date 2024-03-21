"use client ";

import { useState, useTransition } from "react";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ColorColumn } from "./ColorColumn";
import { AlertModal } from "@/components/modals/AlertModal";
import { deleteColor } from "@/actions/storeColor";
import { ADMIN_STORE_ROUTES } from "@/routes";

interface Props {
  data: ColorColumn;
}

const CellAction = ({ data }: Props) => {
  const router = useRouter();
  const params = useParams<{ serviceName: string }>();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onUpdate = () => {
    router.push(`${ADMIN_STORE_ROUTES.COLOR}/${data.id}`);
  };

  const onDelete = async () => {
    startTransition(() => {
      deleteColor(data.id)
        .then(() => {
          router.refresh();
          toast.success("색상 삭제를 완료했습니다.");
        })
        .catch(() => {
          toast.error("문제가 발생했습니다.");
        })
        .finally(() => {
          setOpen(false);
        });
    });
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isPending}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={onUpdate}>
            <Edit className="mr-2 h-4 w-4" />
            수정
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;

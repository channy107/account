"use client";
import { logout } from "@/actions/logout";
import { CardWrapper } from "@/components/auth/CardWrapper";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const LogoutForm = () => {
  const router = useRouter();
  const handleCancel = () => {
    router.back();
  };
  const handleConfirm = async () => {
    await logout()
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <CardWrapper
      headerTitle="로그아웃"
      headerDescription={
        "로그아웃 진행 시 모든 서비스에서 로그아웃 됩니다. \n정말 로그아웃 하시겠습니까?"
      }
    >
      <div className="flex justify-center space-x-4">
        <Button className="w-1/2" onClick={handleCancel}>
          취소
        </Button>

        <Button className="w-1/2" onClick={handleConfirm}>
          로그아웃
        </Button>
      </div>
    </CardWrapper>
  );
};

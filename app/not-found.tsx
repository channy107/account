"use client";
import ErrorComponent from "@/components/common/ErrorComponent";
import { ADMIN_BASE } from "@/routes";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <ErrorComponent
      message="존재하지 않는 페이지거나 개발 중인 페이지입니다."
      actionMessage="홈으로가기"
      actionFn={() => router.push(`${ADMIN_BASE}`)}
    />
  );
}

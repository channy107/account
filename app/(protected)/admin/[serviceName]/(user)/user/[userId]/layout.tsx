import { Suspense } from "react";
import FullScreenLoader from "@/components/common/FullScreenLoader";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<FullScreenLoader />}>{children}</Suspense>;
}

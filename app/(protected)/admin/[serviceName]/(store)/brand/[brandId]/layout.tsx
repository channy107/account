import { Suspense } from "react";
import FullScreenLoader from "@/components/shared/FullScreenLoader";

export default async function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<FullScreenLoader />}>{children}</Suspense>;
}

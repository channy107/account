import { Suspense } from "react";
import FullScreenLoader from "@/components/shared/FullScreenLoader";
import Navbar from "@/components/admin/Navbar";

export default async function ServiceLayout({
  children,
  params: { serviceName },
}: {
  children: React.ReactNode;
  params: { serviceName: string };
}) {
  return (
    <>
      <Suspense fallback={<FullScreenLoader />}>
        <Navbar serviceName={serviceName} />
        {children}
      </Suspense>
    </>
  );
}

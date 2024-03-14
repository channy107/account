import { auth } from "@/auth";
import { UserRole } from "@/db/schema";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

const Guard = async ({ children }: Props) => {
  const session = await auth();
  if (session?.user.role !== UserRole.ADMIN) {
    redirect("/");
  }
  return <>{children}</>;
};

export default Guard;

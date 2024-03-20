import { ADMIN_ROUTES } from "@/routes";
import { redirect } from "next/navigation";

export default function Home() {
  redirect(`${ADMIN_ROUTES.COMMON}`);
}

import { getCategories } from "@/actions/service";
import { ADMIN_BASE } from "@/routes";
import { redirect } from "next/navigation";

interface Props {
  params: { serviceName: string };
}

export default async function Home({ params: { serviceName } }: Props) {
  const categories = await getCategories(serviceName);
  const mainCategory = categories.find((category) => category.isMain);
  redirect(`${ADMIN_BASE}/${serviceName}/${mainCategory?.name}`);
}

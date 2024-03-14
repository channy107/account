import { getCategories } from "@/actions/service";
import { redirect } from "next/navigation";

interface Props {
  params: { serviceName: string };
}

export default async function Home({ params: { serviceName } }: Props) {
  const categories = await getCategories(serviceName);
  const mainCategory = categories.find((category) => category.isMain);
  redirect(`/admin/${serviceName}/${mainCategory?.name}`);
}

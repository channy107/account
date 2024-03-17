import CategoryForm from "./_components/CategoryForm";
import { getCategory } from "@/actions/storeCategory";

interface Props {
  params: { categoryId: string };
}

const CategoryFormPage = async ({ params }: Props) => {
  const category = await getCategory(
    params.categoryId !== "new" ? params.categoryId : undefined
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} />
      </div>
    </div>
  );
};

export default CategoryFormPage;

import { format } from "date-fns";
import { CategoryColumn } from "./_components/CategoryColumn";
import CategoryTable from "./_components/Table";
import { getCategories } from "@/actions/storeCategory";

const CategoryPage = async () => {
  const categories = await getCategories();

  const formattedCategories: CategoryColumn[] = categories.map((category) => {
    return {
      id: category.id,
      smallCategory: category.name,
      mediumCategory: category.parentCategory?.name,
      largeCategory: category.parentCategory?.parentCategory?.name,
      createdAt: format(category.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryTable data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoryPage;

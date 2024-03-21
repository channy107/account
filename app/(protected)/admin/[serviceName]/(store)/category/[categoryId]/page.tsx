import { Suspense } from "react";
import CategoryForm from "./_components/CategoryForm";
import { getCategories } from "@/actions/storeCategory";
import FullScreenLoader from "@/components/shared/FullScreenLoader";

const CategoryFormPage = async () => {
  const largeCategories = await getCategories("large");

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense fallback={<FullScreenLoader />}>
          <CategoryForm largeCategories={largeCategories} />
        </Suspense>
      </div>
    </div>
  );
};

export default CategoryFormPage;

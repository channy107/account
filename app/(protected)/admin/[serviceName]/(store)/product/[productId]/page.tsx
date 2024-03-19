import ProductForm from "./components/ProductForm";
import { getProduct } from "@/actions/storeProduct";
import { getColors } from "@/actions/storeColor";
import { getCategories } from "@/actions/storeCategory";
import { getBrands } from "@/actions/storeBrand";

interface Props {
  params: { productId: string };
}

const ProductFormPage = async ({ params }: Props) => {
  const product = await getProduct(
    params.productId !== "new" ? params.productId : undefined
  );

  const categories = await getCategories();
  const brands = await getBrands();
  const colors = await getColors();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categories}
          colors={colors}
          brands={brands}
        />
      </div>
    </div>
  );
};

export default ProductFormPage;

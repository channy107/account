import { format } from "date-fns";

import { ProductColumn } from "./components/ProductColumn";
import { getProducts } from "@/actions/storeProduct";
import ProductTable from "./components/Table";
import { formatter } from "@/lib/utils";

const ProductsPage = async () => {
  const products = await getProducts();

  const formattedProducts: ProductColumn[] = products.map((product) => {
    const color = product.colorsToProducts
      .map((color) => color.color.name)
      .join(", ");
    const size = product.sizesToProducts
      .map((size) => size.size.name)
      .join(", ");
    return {
      id: product.id,
      name: product.name,
      price: formatter.format(product.price),
      saleRate: product.saleRate,
      images: product.images,
      size,
      brand: product.brand.name,
      category: product.category.name,
      color,
      createdAt: format(product.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductTable data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;

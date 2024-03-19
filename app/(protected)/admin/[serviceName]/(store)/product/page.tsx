import { format } from "date-fns";

import { ProductColumn } from "./components/ProductColumn";
import { getProducts } from "@/actions/storeProduct";
import ProductTable from "./components/Table";
import { formatter } from "@/lib/utils";

const ProductsPage = async () => {
  const products = await getProducts();
  console.log("products", products);

  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: formatter.format(product.price),
    isSale: product.isSale,
    saleRate: product.saleRate,
    images: product.images,
    size: product.size,
    brand: product.brand.value,
    category: product.category.name,
    color: product.color.value,
    createdAt: format(product.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductTable data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;

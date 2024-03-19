import { format } from "date-fns";
import { BrandColumn } from "./_components/BrandColumn";
import BrandTable from "./_components/Table";
import { getBrands } from "@/actions/storeBrand";

export const revalidate = 0;

const BrandPage = async () => {
  const brands = await getBrands();

  const formattedBrands: BrandColumn[] = brands.map((brand) => {
    return {
      id: brand.id,
      name: brand.name,
      value: brand.value,
      createdAt: format(brand.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BrandTable data={formattedBrands} />
      </div>
    </div>
  );
};

export default BrandPage;

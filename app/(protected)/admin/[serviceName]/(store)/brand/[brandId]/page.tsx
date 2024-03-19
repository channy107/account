import BrandForm from "./_components/BrandForm";
import { getBrand } from "@/actions/storeBrand";

interface Props {
  params: { brandId: string };
}

const SizeFormPage = async ({ params }: Props) => {
  const brand = await getBrand(
    params.brandId !== "new" ? params.brandId : undefined
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BrandForm initialData={brand} />
      </div>
    </div>
  );
};

export default SizeFormPage;

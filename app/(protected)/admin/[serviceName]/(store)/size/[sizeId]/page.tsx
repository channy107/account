import { getSize } from "@/actions/storeSize";
import SizeForm from "./_components/SizeForm";

interface Props {
  params: { sizeId: string };
}

const SizeFormPage = async ({ params }: Props) => {
  const size = await getSize(
    params.sizeId !== "new" ? params.sizeId : undefined
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizeFormPage;

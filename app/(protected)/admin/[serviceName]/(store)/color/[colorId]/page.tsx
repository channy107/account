import ColorForm from "./_components/ColorForm";
import { getColor } from "@/actions/storeColor";

interface Props {
  params: { colorId: string };
}

const ColorFormPage = async ({ params }: Props) => {
  const color = await getColor(
    params.colorId !== "new" ? params.colorId : undefined
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorFormPage;

import { format } from "date-fns";

import ColorTable from "./_components/Table";
import { ColorColumn } from "./_components/ColorColumn";
import { getColors } from "@/actions/storeColor";

const ColorPage = async () => {
  const colors = await getColors();

  const formattedColors: ColorColumn[] = colors.map((color) => {
    return {
      id: color.id,
      name: color.name,
      value: color.value,
      createdAt: format(color.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorTable data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorPage;

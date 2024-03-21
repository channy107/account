import { format } from "date-fns";

import SizeTable from "./_components/Table";
import { SizeColumn } from "./_components/SizeColumn";
import { getSizes } from "@/actions/storeSize";

const SizePage = async () => {
  const sizes = await getSizes();

  const formattedSizes: SizeColumn[] = sizes.map((size) => {
    return {
      id: size.id,
      name: size.name,
      value: size.value,
      createdAt: format(size.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeTable data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizePage;

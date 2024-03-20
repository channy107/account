import { format } from "date-fns";
import { BannerColumn } from "./_components/BannerColumn";
import BannerTable from "./_components/Table";
import { getBanners } from "@/actions/storeBanner";

const BannerPage = async () => {
  const banners = await getBanners();

  const formattedBanners: BannerColumn[] = banners.map((banner) => {
    return {
      id: banner.id,
      name: banner.name,
      createdAt: format(banner.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BannerTable data={formattedBanners} />
      </div>
    </div>
  );
};

export default BannerPage;

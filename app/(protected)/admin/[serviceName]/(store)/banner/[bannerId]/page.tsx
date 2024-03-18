import BannerForm from "./_components/BannerForm";
import { getBanner } from "@/actions/storeBanner";

interface Props {
  params: { bannerId: string };
}

const BannerFormPage = async ({ params }: Props) => {
  const banner = await getBanner(
    params.bannerId !== "new" ? params.bannerId : undefined
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BannerForm initialData={banner} />
      </div>
    </div>
  );
};

export default BannerFormPage;

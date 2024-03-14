import UserForm from "./_components/UserForm";
import { getUser } from "@/actions/user";

interface Props {
  params: { userId: string };
}

const UserPage = async ({ params }: Props) => {
  const user = await getUser(params.userId);
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UserForm user={user} />
      </div>
    </div>
  );
};

export default UserPage;

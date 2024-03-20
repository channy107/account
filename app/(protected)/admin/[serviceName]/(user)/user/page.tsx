import { format } from "date-fns";
import { UserColumn } from "./_components/UserColumn";
import UserTable from "./_components/Table";
import { getUsers } from "@/actions/user";

const UserListPage = async () => {
  const users = await getUsers();

  const formattedUsers: UserColumn[] = users.map((item) => {
    const type =
      item.accounts.length === 0
        ? "email"
        : `OAuth(${item.accounts[0].provider})`;
    return {
      id: item.id,
      name: item.name ?? "-",
      email: item.email ?? "-",
      role: item.role ?? "user",
      type,
      image: item.image ?? "",
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UserTable data={formattedUsers} />
      </div>
    </div>
  );
};

export default UserListPage;

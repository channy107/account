import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/db/schema";

interface Props {
  role: string;
}

const RoleCell = ({ role = UserRole.USER }: Props) => {
  const isAdmin = role === UserRole.ADMIN;
  const badgeInfo: { label: string; variant: "default" | "secondary" } = {
    label: isAdmin ? "관리자" : "일반",
    variant: isAdmin ? "default" : "secondary",
  };
  return <Badge variant={badgeInfo.variant}>{badgeInfo.label}</Badge>;
};

export default RoleCell;

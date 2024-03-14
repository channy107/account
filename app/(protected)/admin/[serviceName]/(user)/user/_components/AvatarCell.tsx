import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserColumn } from "./UserColumn";

interface Props {
  data: UserColumn;
}

const AvatarCell = ({ data }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src={data.image} alt="avatar" />
        <AvatarFallback>{data.name[0]}</AvatarFallback>
      </Avatar>
      {data.name}
    </div>
  );
};

export default AvatarCell;

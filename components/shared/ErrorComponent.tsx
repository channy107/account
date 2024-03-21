import { AlertTriangle } from "lucide-react";

interface IProps {
  message: string;
  actionMessage: string;
  actionFn: () => void;
}

const ErrorComponent = ({ message, actionMessage, actionFn }: IProps) => {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-2.5 mt-10">
      <AlertTriangle color="#FF7070" size={64} />
      <p className="text-lg font-semibold">{message}</p>
      <button
        className="py-2 px-4 bg-[#FF7070] rounded font-medium text-white"
        onClick={actionFn}
      >
        {actionMessage}
      </button>
    </div>
  );
};

export default ErrorComponent;

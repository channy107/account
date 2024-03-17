interface Props {
  value: string;
}

const ColorCell = ({ value }: Props) => {
  return (
    <div className="flex items-center gap-x-2">
      {value}
      <div
        className="h-6 w-6 rounded-full border"
        style={{ backgroundColor: value }}
      />
    </div>
  );
};

export default ColorCell;

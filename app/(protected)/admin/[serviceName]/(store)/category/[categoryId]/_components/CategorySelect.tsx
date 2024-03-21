import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ArrowDown, PlusCircle } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { TCategoryType } from "./CategoryForm";

interface Props {
  disabled: boolean;
  type: string;
  value: string;
  name: TCategoryType;
  items: any[];
  onSelect: ({
    id,
    name,
    value,
  }: {
    id: string;
    name: TCategoryType;
    value: string;
  }) => void;
  setIsNew: Dispatch<
    SetStateAction<{
      largeCategoryName: boolean;
      mediumCategoryName: boolean;
      smallCategoryName: boolean;
    }>
  >;
}

const CategorySelect = ({
  disabled,
  name,
  value,
  type,
  items,
  onSelect,
  setIsNew,
}: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={`${type} 선택`}
            className="w-full justify-between"
            disabled={disabled}
          >
            {value === "" ? "카테고리를 선택해주세요." : value}

            <ArrowDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="대분류" />
              <CommandEmpty>검색결과가 없습니다.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  className="cursor-pointer"
                  onSelect={() =>
                    setIsNew((prev) => ({
                      ...prev,
                      [name]: !prev[name],
                    }))
                  }
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  새로 만들기
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => {
                      onSelect({
                        id: item.id,
                        name,
                        value: item.name,
                      });
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CategorySelect;

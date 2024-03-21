"use client";

import { useRef, useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { TSelectStoreColor, TSelectStoreSize } from "@/db/schema";

import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { productFormSchema } from "@/schemas/admin";

type TItem = TSelectStoreColor | TSelectStoreSize;

interface Props {
  items: TItem[];
  name: keyof z.infer<typeof productFormSchema>;
}

const MultiSelect = ({ name, items }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { watch, setValue, setError, clearErrors } = useFormContext();

  const selectedItems = watch(name);
  const selectedItemsSet = new Set(selectedItems.map((item: TItem) => item.id));
  const selectableItems = items.filter(
    (item) => !selectedItemsSet.has(item.id)
  );

  const handleUnselect = (item: TItem) => {
    const filterSelectedItems = selectedItems.filter(
      (selectedItem: TSelectStoreColor | TSelectStoreSize) =>
        selectedItem.name !== item.name
    );
    setValue(name, filterSelectedItems);
    if (filterSelectedItems.length === 0) {
      setError(name, {
        type: "required",
        message: "최소 한 개 이상 선택해주세요.",
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          const newSelected = [...selectedItems].pop();
          setValue(name, newSelected);
        }
      }
      if (e.key === "Escape") {
        input.blur();
      }
    }
  };

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent h-10"
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selectedItems.map((item: TItem) => {
            return (
              <Badge key={item.id} variant="secondary">
                {item.name}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(item);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(item)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={
              selectedItems && selectedItems.length !== 0 ? "" : "선택해주세요."
            }
            className="bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectableItems.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              <CommandGroup className="h-full overflow-auto">
                {selectableItems.map((item) => {
                  return (
                    <CommandItem
                      key={item.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(v) => {
                        setInputValue("");
                        clearErrors(name);
                        setValue(name, [...selectedItems, item]);
                      }}
                      className={"cursor-pointer"}
                    >
                      {item.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </div>
        ) : null}
      </div>
    </Command>
  );
};

export default MultiSelect;

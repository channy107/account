"use client";

import { useState } from "react";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
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

import { cn } from "@/lib/utils";
import { TSelectService } from "@/db/schema";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: TSelectService[];
}

const ServiceSwitcher = ({ className, items = [] }: StoreSwitcherProps) => {
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.label,
    value: item.name,
  }));

  const currentService = formattedItems.find(
    (item) => item.value === params.serviceName
  );

  const [open, setOpen] = useState(false);

  const onServiceSelect = (service: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/admin/${service.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label={"서비스를 선택해주세요."}
          className={cn("w-[200px] justify-between", className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentService?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="서비스 이름" />
            <CommandEmpty>해당하는 서비스가 없습니다.</CommandEmpty>
            <CommandGroup heading="Services">
              {formattedItems.map((service) => (
                <CommandItem
                  key={service.value}
                  onSelect={() => onServiceSelect(service)}
                  className="text-sm"
                  disabled={currentService?.value === service.value}
                >
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {service.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentService?.value === service.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Service
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ServiceSwitcher;

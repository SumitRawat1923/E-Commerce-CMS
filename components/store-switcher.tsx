"use client";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Store } from "@prisma/client";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useParams, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;
interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

function StoreSwitcher({ className, items = [] }: StoreSwitcherProps) {
  const [open, setOpen] = useState(false);
  const StoreModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((store) => ({
    value: store.id,
    label: store.name,
  }));

  const currentStore = items.find((store) => params.storeId === store.id);
  const onStoreSelect = (store: { label: string; value: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"sm"}
          aria-label="select a store"
          role="ComboBox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between ", className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.name}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((store) => (
                <CommandItem
                  onSelect={() => onStoreSelect(store)}
                  key={store.value}
                >
                  <StoreIcon className="mr-2 w-4 h-4" />
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 ",
                      currentStore?.id === store.value
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
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    StoreModal.onOpen();
                  }}
                >
                  <PlusCircle className="mr-2 w-5 h-5" />
                  Create Store
                </CommandItem>
              </CommandGroup>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default StoreSwitcher;

"use client";

import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface CustomSwitchProps {
  name: string;
  label: string;
  description: string;
  className?: string;
}

export function CustomSwitch({
  name,
  label,
  description,
  className,
}: CustomSwitchProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row w-full items-center justify-between rounded-lg border p-3 shadow-sm bg-foreground",
            className
          )}
        >
          <div className="space-y-0.5">
            <FormLabel className="text-white">{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-green-800 data-[state=unchecked]:bg-foreground border border-white/10"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

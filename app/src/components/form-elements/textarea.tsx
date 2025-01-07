"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../ui/form";
import React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

type CustomInputProps = {
  name: string;
  placeholder?: string;
  label: string;
  className?: string;
  rows?: number;
  defaultValue?: string;
};

const CustomTextarea = ({
  name,
  placeholder,
  label,
  className,
  rows = 4,
  defaultValue = "",
}: CustomInputProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem className="w-full relative">
          <FormLabel className="absolute left-4 top-3 after:border-b after:border-b-white/30 after:w-full after:absolute after:-left-4 after:pb-1 after:top-4 w-full text-muted-foreground">
            {label}
          </FormLabel>
          <FormControl>
            <Textarea
              {...field}
              className={cn(
                "w-full bg-foreground text-white/80 pt-8 rounded-lg border border-white/30 resize-none",
                className
              )}
              value={field.value}
              placeholder={placeholder}
              rows={rows}
            />
          </FormControl>
          <FormMessage className="text-xs font-semibold text-red-600" />
        </FormItem>
      )}
    />
  );
};

export default CustomTextarea;

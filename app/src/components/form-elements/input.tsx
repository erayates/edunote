"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import React from "react";
import { cn } from "@/lib/utils";

type CustomInputProps = {
  name: string;
  placeholder?: string;
  type?: string;
  label: string;
  className?: string;
};

const CustomInput: React.FC<CustomInputProps> = ({
  name,
  placeholder,
  type,
  label,
}) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full relative">
          <FormLabel className="absolute left-4 top-3 after:border-b after:border-b-white/30 after:w-full after:absolute after:-left-4 after:pb-1 after:top-4 w-full text-muted-foreground">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              className={cn(
                "w-full bg-foreground text-white/80 pt-6 h-16 rounded-lg border border-white/30"
              )}
              placeholder={placeholder}
              value={field.value}
              type={type ? type : "text"}
            />
          </FormControl>
          <FormMessage className="text-xs font-semibold text-red-600" />
        </FormItem>
      )}
    />
  );
};

export default CustomInput;

"use client";

import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FileInputProps {
  name: string;
  label: string;
  accept?: string;
  className?: string;
}

export default function FileInput({ name, label, accept, className }: FileInputProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const { control } = useFormContext();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setPreview(fileUrl);
    return file;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem className="relative">
          <FormLabel
            htmlFor={name}
            className={cn(
              "w-full h-64 bg-primary border-2 grid z-10 place-items-center text-white rounded-lg border-white border-dashed cursor-pointer",
              className
            )}
          >
            {label}
            {preview && (
              <Image
                src={preview}
                alt="Preview"
                fill
                className="absolute inset-0 object-cover opacity-20"
              />
            )}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              id={name}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(event) => {
                const file = handleFileChange(event);
                onChange(file);
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

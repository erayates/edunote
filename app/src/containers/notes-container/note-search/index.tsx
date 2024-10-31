"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { useDebouncedCallback } from "use-debounce";

const NoteSearch: React.FC<{
  setCurrentPage: Dispatch<SetStateAction<number>>;
}> = ({ setCurrentPage }) => {
  const searchParams = useSearchParams();

  const router = useRouter();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value;
    debounce(searchQuery);
  };

  const debounce = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "" && value) {
      params.delete("search");
      router.replace(`/notes?${params.toString()}`);
      return;
    }
    params.set("search", value);
    setCurrentPage(1);
    router.replace(`/notes?${params.toString()}`);
  });

  return (
    <Input
      placeholder="Start searching..."
      className="bg-foreground text-sm border-2 border-primary p-4 rounded-xl h-[48px] focus-visible:ring-primary text-white placeholder:text-primary"
      onChange={handleSearch}
    />
  );
};

export default NoteSearch;

"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const NoteSearch: React.FC = () => {
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
    router.replace(`/notes?${params.toString()}`);
  });

  return (
    <Input
      placeholder="Start searching..."
      className="bg-foreground text-sm border-2 border-secondary p-4 rounded-xl h-[48px] focus-visible:ring-secondary text-white placeholder:text-secondary"
      onChange={handleSearch}
    />
  );
};

export default NoteSearch;

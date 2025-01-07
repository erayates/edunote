"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

const NoteSearch: React.FC<{
  setCurrentPage: Dispatch<SetStateAction<number>>;
}> = ({ setCurrentPage }) => {
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value;
    debounce(searchQuery);
  };

  useEffect(() => {
    const search = searchParams.get("search");
    if (search && searchRef.current) {
      searchRef.current.value = search;
    }
  }, []);

  const debounce = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "" && value) {
      params.delete("search");
      router.replace(`/groups?${params.toString()}`);
      return;
    }
    params.set("search", value);
    setCurrentPage(1);
    router.replace(`/groups?${params.toString()}`);
  });

  return (
    <Input
      placeholder="Start searching..."
      ref={searchRef}
      className="bg-foreground text-sm border-2 border-primary p-4 rounded-xl h-[48px] focus-visible:ring-primary text-white placeholder:text-primary"
      onChange={handleSearch}
    />
  );
};

export default NoteSearch;

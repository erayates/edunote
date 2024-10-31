"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

import { format } from "date-fns";
import ComboBox from "@/components/ui/combobox";
import slug from "slug";

const NoteFilter: React.FC<{
  setCurrentPage: Dispatch<SetStateAction<number>>;
}> = ({ setCurrentPage }) => {
  const [date, setDate] = React.useState<Date | undefined>();
  const [selectedTags, setSelectedTags] = React.useState<
    { value: string; id: string; label: string }[]
  >([]);

  const router = useRouter();

  useEffect(() => {
    if (selectedTags.length > 0)
      debounced(selectedTags.map((tag) => slug(tag.label)).join(","), "tags");
  }, [selectedTags]);
  

  const searchParams = useSearchParams();

  const onDateSelect = (e: Date | undefined) => {
    if (e) {
      setDate(e);
      const formattedDate = format(e, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
      debounced(formattedDate.toString(), "createdAt");
    }
  };

  const onAuthorFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const author = e.target.value;
    debounced(author, "author");
  };

  const debounced = useDebouncedCallback((value: string, type: string) => {
    const params = new URLSearchParams(searchParams);
    if (!value) {
      params.delete(type);
      setCurrentPage(1);
      router.replace(`/notes?${params.toString()}`);
      return;
    }

    params.set(type, value);
    setCurrentPage(1);
    router.replace(`/notes?${params.toString()}`);
  }, 300);

  return (
    <div className="w-[300px] max-w-[300px] sticky top-4  h-fit bg-foreground border-2 border-primary rounded-xl p-2">
      <p className="text-white/30 uppercase font-semibold text-center text-xl">
        Filters
      </p>

      <div className="rounded-full h-[1px] w-full bg-primary my-2"></div>
      <div className="space-y-2">
        <div className="space-y-1 w-[280px] max-w-[280px]">
          <p className="text-sm text-white/30 font-medium">Tags</p>
          <ComboBox
            selectedTags={selectedTags}
            type="search"
            setSelectedTags={setSelectedTags}
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm text-white/30 font-medium">Author</p>
          <Input
            className="focus-visible:ring-primary text-white text-xs"
            onChange={onAuthorFilterChange}
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm text-white/30 font-medium leading-4">
            Published Date
          </p>
          <DatePicker
            setDate={setDate}
            date={date}
            onDateSelect={onDateSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteFilter;

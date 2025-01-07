"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

import { format } from "date-fns";
import ComboBox from "@/components/ui/combobox";

const NoteFilter: React.FC<{
  setCurrentPage: Dispatch<SetStateAction<number>>;
}> = ({ setCurrentPage }) => {
  const [date, setDate] = React.useState<Date | undefined>();
  const [selectedTags, setSelectedTags] = React.useState<
    { value: string; id: string; label: string }[]
  >([]);

  const router = useRouter();

  const authorRef = useRef<HTMLInputElement>(null);
  

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (selectedTags.length > 0) {
      debounced(selectedTags.map((tag) => tag.id).join(","), "tags");
      return;
    }

    if (selectedTags.length === 0) {
      params.delete("tags");
      setCurrentPage(1);
      router.replace(`/groups?${params.toString()}`);
      return;
    }
  }, [selectedTags]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const author = params.get("author");
    if (author && authorRef.current) {
      authorRef.current.value = author;
    }

    const createdAt = params.get("createdAt");
    if (createdAt) {
      setDate(new Date(createdAt));
    }
  }, []);

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
  }, 500);

  return (
    <div className="w-[500px] max-w-[500px] sticky top-4  h-fit bg-foreground border-2 border-primary rounded-xl p-2">
      <p className="text-white/30 uppercase font-semibold text-center text-xl">
        Filters
      </p>

      <div className="rounded-full h-[1px] w-full bg-primary my-2"></div>
      <div className="space-y-2">
        <div className="space-y-1 w-full">
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
            name="author"
            ref={authorRef}
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

"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "./scroll-area";
import { useDebouncedCallback } from "use-debounce";
import { getAllTags, searchTags } from "@/actions/tags";
import { toast } from "sonner";

interface Tag {
  value: string;
  label: string;
}

interface ComboBoxProps {
  defaultTags: Tag[];
  selectedTags: Tag[];
  setSelectedTags: React.Dispatch<
    React.SetStateAction<{ value: string; label: string }[]>
  >;
}

const ITEMS_PER_PAGE = 15;
const MAX_SELECTED_TAGS = 5;

export default function ComboBox({
  defaultTags,
  selectedTags,
  setSelectedTags,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [skippedTag, setSkippedTag] = React.useState(15);
  const [displayedTags, setDisplayedTags] = React.useState<Tag[]>(
    defaultTags || []
  );
  const [inputValue, setInputValue] = React.useState("");
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Use a ref to store the last scroll position
  const lastScrollPositionRef = React.useRef(0);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    // Root margin to trigger loading earlier
    rootMargin: "100px",
  });

  const loadMoreTags = React.useCallback(async () => {
    if (!loading && hasMore) {
      // Store current scroll position before loading
      if (scrollContainerRef.current) {
        lastScrollPositionRef.current = scrollContainerRef.current.scrollTop;
      }

      setLoading(true);
      try {
        const newTags = await getAllTags(skippedTag);
        if (newTags && newTags.length > 0) {
          setDisplayedTags((prev) => [...prev, ...newTags]);
          setSkippedTag((prev) => prev + ITEMS_PER_PAGE);
          setHasMore(newTags.length === ITEMS_PER_PAGE);

          // Restore scroll position after state update
          requestAnimationFrame(() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTop =
                lastScrollPositionRef.current;
            }
          });
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Failed to load more tags:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [loading, hasMore, skippedTag]);

  React.useEffect(() => {
    if (inView) {
      loadMoreTags();
    }
  }, [inView, loadMoreTags]);

  const handleSearch = (value: string) => {
    setInputValue(value);
    performSearch(value);
  };

  const performSearch = useDebouncedCallback(async (value: string) => {
    setLoading(true);
    try {
      if (!value.trim()) {
        setDisplayedTags(defaultTags || []);
        setSkippedTag(ITEMS_PER_PAGE);
        setHasMore(true);
      } else {
        const results = await searchTags(value);
        if (results) {
          setDisplayedTags(results);
          setHasMore(results.length === ITEMS_PER_PAGE);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSelect = (currentValue: string) => {
    if (selectedTags.length >= MAX_SELECTED_TAGS) {
      toast.error(`You can only select up to ${MAX_SELECTED_TAGS} tags.`);
      return;
    }

    const tag = displayedTags.find((t) => t.value === currentValue);
    if (tag) {
      setSelectedTags((prev) => {
        const exists = prev.some((t) => t.value === tag.value);
        if (exists) {
          return prev.filter((t) => t.value !== tag.value);
        }
        return [...prev, tag];
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();

      if (selectedTags.length >= MAX_SELECTED_TAGS) {
        toast.error(`You can only select up to ${MAX_SELECTED_TAGS} tags.`);
        return;
      }

      const normalizedValue = inputValue.trim().toLowerCase();

      if (selectedTags.some((tag) => tag.value === normalizedValue)) {
        toast.error("This tag is already selected.");
        return;
      }

      const newTag = {
        value: normalizedValue,
        label: inputValue.trim(),
      };

      setSelectedTags((prev) => [...prev, newTag]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.value !== tagToRemove));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-[2.5rem] border-secondary align-top"
        >
          <div className="flex flex-wrap gap-1 items-center">
            {selectedTags.map((tag) => (
              <span
                key={tag.value}
                className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center"
              >
                {tag.label}
                <button
                  className="ml-1 text-secondary-foreground/50 hover:text-secondary-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag.value);
                  }}
                >
                  <Cross2Icon className="h-3 w-3" />
                </button>
              </span>
            ))}
            <span className="text-white/30">
              {selectedTags.length === 0 && "Select or add tags..."}
            </span>
          </div>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-foreground" align="start">
        <Command className="bg-foreground">
          <CommandInput
            placeholder="Search or create new tag..."
            className="h-9 text-white text-xs"
            value={inputValue}
            onKeyDown={handleKeyDown}
            onValueChange={handleSearch}
          />
          <CommandList>
            <CommandEmpty className="text-white/30 text-sm p-4 text-center">
              {loading
                ? "Searching..."
                : `No tags found. Press enter to create "${inputValue}" tag.`}
            </CommandEmpty>
            <CommandGroup>
              <ScrollArea
                className="h-[200px]"
                ref={scrollContainerRef}
                type="always"
              >
                <div className="p-1">
                  {displayedTags.map((tag) => (
                    <CommandItem
                      key={tag.value}
                      value={tag.value}
                      onSelect={handleSelect}
                      className="mt-1 first:mt-0"
                    >
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            selectedTags.some((t) => t.value === tag.value)
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <CheckIcon className={cn("h-4 w-4 text-white")} />
                        </div>
                        <span className="text-white/50">{tag.label}</span>
                      </div>
                    </CommandItem>
                  ))}
                  {hasMore && (
                    <div
                      ref={loadMoreRef}
                      className="w-full h-8 flex items-center justify-center"
                    >
                      <span className="text-white/30 text-sm">
                        {loading ? "Loading..." : "Scroll for more..."}
                      </span>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

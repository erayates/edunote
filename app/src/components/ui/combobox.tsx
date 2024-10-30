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
import { createTag, getAllTags, searchTags } from "@/actions/tags";
import { toast } from "sonner";
import { randomBytes } from "crypto";

interface Tag {
  value: string;
  label: string;
  id: string;
}

interface ComboBoxProps {
  selectedTags: Tag[];
  setSelectedTags: React.Dispatch<
    React.SetStateAction<{ value: string; label: string; id: string }[]>
  >;
  type?: string;
  // defaultSelectedTags?: { value: string; label: string; id: string }[];
}

const ITEMS_PER_PAGE = 15;
const MAX_SELECTED_TAGS = 5;

export default function ComboBox({
  selectedTags,
  setSelectedTags,
  // defaultSelectedTags,
  type,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [skippedTag, setSkippedTag] = React.useState(15);
  const [defaultDisplayedTags, setDefaultDisplayedTags] = React.useState<Tag[]>(
    []
  );

  const [searchResults, setSearchResults] = React.useState<Tag[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const lastScrollPositionRef = React.useRef(0);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });

  React.useEffect(() => {
    const fetchAllTags = async () => {
      const tags = await getAllTags();
      if (tags) {
        setDefaultDisplayedTags(tags);
      }
    };

    fetchAllTags();
  }, []);

  const displayedTags = isSearching ? searchResults : defaultDisplayedTags;

  const loadMoreTags = React.useCallback(async () => {
    if (!loading && hasMore && !isSearching) {
      if (scrollContainerRef.current) {
        lastScrollPositionRef.current = scrollContainerRef.current.scrollTop;
      }

      setLoading(true);
      try {
        const newTags = await getAllTags(skippedTag);
        if (newTags && newTags.length > 0) {
          setDefaultDisplayedTags((prev) => [...prev, ...newTags]);
          setSkippedTag((prev) => prev + ITEMS_PER_PAGE);
          setHasMore(newTags.length === ITEMS_PER_PAGE);

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
  }, [loading, hasMore, skippedTag, isSearching]);

  React.useEffect(() => {
    if (inView && !isSearching) {
      loadMoreTags();
    }
  }, [inView, loadMoreTags, isSearching]);

  const handleSearch = (value: string) => {
    setInputValue(value);
    performSearch(value);
  };

  const performSearch = useDebouncedCallback(async (value: string) => {
    if (!value.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setIsSearching(true);
    try {
      const results = await searchTags(value);
      if (results) {
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSelect = (currentValue: string) => {
    const tag = displayedTags.find((t) => t.value === currentValue);
    if (tag) {
      setSelectedTags((prev) => {
        const exists = prev.some((t) => t.value === tag.value);
        if (exists) {
          return prev.filter((t) => t.value !== tag.value);
        }

        if (selectedTags.length >= MAX_SELECTED_TAGS) {
          toast.error(`You can only select up to ${MAX_SELECTED_TAGS} tags.`);
          return [...prev];
        }

        return [...prev, tag];
      });
    }
  };

  // Creating new tag
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "search") return;

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

      const createdTag = await createTag(normalizedValue);

      if (createdTag) {
        setSelectedTags((prev) => [
          ...prev,
          {
            id: createdTag.id,
            label: createdTag.name,
            value: createdTag.name,
          },
        ]);

        toast.success("Tag created successfully.");
      }

      setInputValue("");
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  // Remove already exist tag
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
                key={tag.id + randomBytes(5).toString("hex")}
                className="bg-secondary text-balance text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center"
              >
                {tag.label}
                <div
                  className="ml-1 text-secondary-foreground/50 hover:text-secondary-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag.value);
                  }}
                >
                  <Cross2Icon className="h-3 w-3" />
                </div>
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
            placeholder={
              type === "search"
                ? "Search a tag..."
                : "Search or create new tag..."
            }
            className="h-9 text-white text-xs"
            value={inputValue}
            onKeyDown={handleKeyDown}
            onValueChange={handleSearch}
          />
          <CommandList>
            <CommandEmpty className="text-white/30 text-sm p-4 text-center">
              {loading
                ? "Searching..."
                : type === "search"
                ? "No tags found."
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
                      key={tag.id + randomBytes(5).toString("hex")}
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
                  {hasMore && !isSearching && (
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

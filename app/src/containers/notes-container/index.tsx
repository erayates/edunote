"use client";

import { BookKey } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import NoteCard from "./note-card";
import NoteFilter from "./note-filter";
import { Prisma } from "@prisma/client";
import NoteSearch from "./note-search";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface NotesContainerProps {
  notes: Prisma.NoteGetPayload<{ include: { user: true; tags: true } }>[];
}

const NotesContainer: React.FC<NotesContainerProps> = ({ notes }) => {
  const [isLoading, setIsLoading] = useState(false);
  // const [hasMore, setHasMore] = useState();
  const [take, setTake] = useState(10);
  const [scrollPosition, setScrollPosition] = useState(0);

  const searchParams = useSearchParams();
  const router = useRouter();

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });

  const loadMore = () => {
    if (isLoading) return;

    setScrollPosition(window.scrollY);
    setIsLoading(true);

    const params = new URLSearchParams(searchParams);
    params.set("take", (take + 10).toString());

    router.push(`/notes?${params.toString()}`, { scroll: false });
    setTake((prev) => prev + 10);

    setIsLoading(false);
  };

  // Restore scroll position after loading more items
  React.useEffect(() => {
    if (scrollPosition > 0) {
      window.scrollTo({
        top: scrollPosition,
        behavior: "instant",
      });
    }
  }, [notes, scrollPosition]);

  React.useEffect(() => {
    if (inView) {
      loadMore();
      return;
    }

    setIsLoading(false);
  }, [inView]);

  return (
    <div className="space-y-6 w-full">
      <div className="flex space-x-6 w-full">
        <div className="bg-foreground border-2 border-secondary relative w-[180px] h-[160px] rounded-full">
          <Image
            src="/assets/images/note-icon.webp"
            alt="Note Icon"
            width={250}
            height={75}
            sizes="100vw"
            className="absolute left-0 top-0 scale-110"
          />
        </div>

        <div className="bg-foreground border-2 border-secondary rounded-lg p-4 relative w-full">
          <p className="text-6xl text-white font-bold">
            UNLOCK YOUR
            <br /> KNOWLEDGE
          </p>
          <BookKey className="absolute right-4 top-4" size={32} color="white" />
          <p className="absolute bottom-4 right-4 text-secondary font-semibold text-right">
            Explore all public notes <br /> from the world & unlock your
            knowledge!
          </p>
        </div>
      </div>

      <div className="flex space-x-6">
        <NoteFilter />

        <div className="flex flex-col w-full space-y-6">
          <NoteSearch />

          <div className="grid grid-cols-4 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={String(note.id)}
                thumbnailUrl={note.thumbnail as string}
                avatarUrl={note.user.avatar as string}
                title={note.title}
                description={note.description}
                updatedAt={note.updatedAt}
                author={note.user.fullname}
                slug={note.slug}
                tags={note.tags.map((tag) => tag.name)}
              />
            ))}
          </div>

          <div
            ref={ref}
            className="w-full h-10 flex items-center justify-center"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesContainer;

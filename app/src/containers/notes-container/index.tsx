"use client";

import { BookKey } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import NoteCard from "./note-card";
import NoteFilter from "./note-filter";
import { Prisma } from "@prisma/client";
import NoteSearch from "./note-search";
import NotePagination from "./note-pagination";
import { useSearchParams } from "next/navigation";

interface NotesContainerProps {
  notes: Prisma.NoteGetPayload<{ include: { user: true; tags: true } }>[];
  totalNotes: number;
}

const NotesContainer: React.FC<NotesContainerProps> = ({
  notes,
  totalNotes,
}) => {
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  return (
    <div className="space-y-6 w-full">
      <div className="flex space-x-6 w-full">
        <div className="bg-foreground border-2 border-primary relative w-[180px] h-[160px] rounded-full">
          <Image
            src="/assets/images/note-icon.webp"
            alt="Note Icon"
            width={250}
            height={75}
            sizes="100vw"
            className="absolute left-0 top-0 scale-110"
          />
        </div>

        <div className="bg-foreground border-2 border-primary rounded-lg p-4 relative w-full">
          <p className="text-6xl text-white font-bold">
            UNLOCK YOUR
            <br /> KNOWLEDGE
          </p>
          <BookKey className="absolute right-4 top-4" size={32} color="white" />
          <p className="absolute bottom-4 right-4 text-primary font-semibold text-right">
            Explore all public notes <br /> from the world & unlock your
            knowledge!
          </p>
        </div>
      </div>

      <div className="flex space-x-6">
        <NoteFilter setCurrentPage={setCurrentPage} />

        <div className="flex flex-col w-full space-y-6">
          <NoteSearch setCurrentPage={setCurrentPage} />

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

          <NotePagination
            totalNotes={totalNotes}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default NotesContainer;

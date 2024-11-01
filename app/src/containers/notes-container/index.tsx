"use client";

import { BookKey } from "lucide-react";
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
        <NoteFilter setCurrentPage={setCurrentPage} />
        <div className=" relative w-full">
          <p className="text-7xl text-white font-bold bg-foreground border-2 border-primary rounded-lg p-6 relative w-full">
            NOTE
            <br /> NETWORK
          </p>
          <BookKey className="absolute right-4 top-4" size={32} color="white" />
          <div className="relative w-full pt-4 ">
            <NoteSearch setCurrentPage={setCurrentPage} />
          </div>
        </div>
      </div>

      <div className="flex space-x-6">
        <div className="flex flex-col w-full space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {notes.length === 0 && (
              <p className="text-white/30 col-span-full bg-foreground border-2 border-primary rounded-lg p-6 text-center text-lg font-semibold mb-3">
                There is no notes.
              </p>
            )}

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

import { _notes } from "@/_mocks/notes";
import { Input } from "@/components/ui/input";
import { BookKey } from "lucide-react";
import Image from "next/image";
import React from "react";
import NoteCard from "./note-card";
import NoteFilter from "./note-filter";
import { Prisma } from "@prisma/client";

interface NotesContainerProps {
  notes: Prisma.NoteGetPayload<{ include: { user: true } }>[];
}

const NotesContainer: React.FC<NotesContainerProps> = ({ notes }) => {
  return (
    <div className="max-w-screen-lg space-y-6">
      <div className="flex space-x-6 ">
        <div className="bg-foreground border-2 border-secondary relative w-[150px] h-[150px] rounded-full">
          <Image
            src="/assets/images/note-icon.webp"
            alt="Note Icon"
            width={250}
            height={75}
          />
        </div>

        <div className="bg-foreground border-2 border-secondary rounded-lg p-4 relative">
          <p className="text-6xl text-white font-bold">UNLOCK YOUR KNOWLEDGE</p>
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
          <Input
            placeholder="Start searching..."
            className="bg-foreground text-sm border-2 border-secondary p-4 rounded-xl h-[48px] focus-visible:ring-secondary text-white placeholder:text-secondary"
          />

          <div className="grid grid-cols-4 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={String(note.id)}
                thumbnailUrl={note.thumbnail as string}
                avatarUrl={note.user.avatar as string}
                title={note.title}
                description={note.description}
                createdAt={note.createdAt}
                author={note.user.fullname}
                slug={note.slug}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesContainer;

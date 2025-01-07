"use client";

import { BookKey } from "lucide-react";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
// import NoteFilter from "../notes-container/note-filter";
import NoteSearch from "../notes-container/note-search";
import { GroupWithRelations } from "@/types/group";

interface GroupsContainerProps {
  groups: GroupWithRelations[];
  totalNotes: number;
}

const GroupsContainer: React.FC<GroupsContainerProps> = (
  {
    //   groups,
    //   totalNotes,
  }
) => {
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  console.log(currentPage)

//   const { user } = useUser();

  return (
    <div className="space-y-6 w-full">
      <div className="flex space-x-6 w-full">
        {/* <NoteFilter setCurrentPage={setCurrentPage} /> */}
        <div className=" relative w-full">
          <p className="text-7xl text-white font-bold bg-foreground border-2 border-primary rounded-lg p-6 relative w-full">
            GROUP
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
            {/* {notes.length === 0 && (
              <p className="text-white/30 col-span-full bg-foreground border-2 border-primary rounded-lg p-6 text-center text-lg font-semibold mb-3">
                There is no notes.
              </p>
            )}

            {notes.map((note) => (
              <NoteCard
                isFavorited={note.favoritedByIds.some(
                  (userId) => userId === user?.id
                )}
                key={String(note.id)}
                noteId={note.id}
                thumbnailUrl={note.thumbnail as string}
                avatarUrl={note.user.avatar as string}
                title={note.title}
                description={note.description}
                updatedAt={note.updatedAt}
                author={note.user.fullname}
                slug={note.slug}
                tags={note.tags.map((tag) => tag.name)}
                noteUserId={note.userId}
              />
            ))}
          </div>

          <NotePagination
            totalNotes={totalNotes}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsContainer;

"use client";

import { BookKey } from "lucide-react";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
// import NoteFilter from "../notes-container/note-filter";
import NoteSearch from "../notes-container/note-search";
import { GroupWithRelations } from "@/types/group";
import GroupCard from "./group-card";

interface GroupsContainerProps {
  groups: GroupWithRelations[];
  totalNotes: number;
}

const GroupsContainer: React.FC<GroupsContainerProps> = ({
  groups,
  //   totalNotes,
}) => {
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

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
            {groups.length === 0 && (
              <p className="text-white/30 col-span-full bg-foreground border-2 border-primary rounded-lg p-6 text-center text-lg font-semibold mb-3">
                There is no notes.
              </p>
            )}

            {groups.map((group) => (
              <GroupCard
                key={String(group.id)}
                // groupId={group.id}
                imageUrl={group.imageUrl as string}
                avatar={group.avatar as string}
                name={group.name}
                description={group.description}
                slug={group.slug}
                visibility={group.visibility}
                // settings={group.settings}
                // members={group.members}
              />
            ))}
          </div>

          {/* <NotePagination
            totalNotes={totalNotes}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default GroupsContainer;

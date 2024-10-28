"use client";

import { getAllUserNotes } from "@/actions/notes";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Note } from "@prisma/client";
import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AIChatSelectionProps {
  open: boolean;
  currentNote: any;
  setCurrentNote: any;
}

const AIChatSelection: React.FC<AIChatSelectionProps> = ({
  open,
  currentNote,
  setCurrentNote,
}) => {
  const [userNotes, setUserNotes] = useState<Note[]>([]);

  const { user } = useUser();

  useEffect(() => {
    const fetchNote = async () => {};
  }, [currentNote]);

  useEffect(() => {
    const fetchAllUserNotes = async () => {
      const notes = await getAllUserNotes(user?.id as string);
      console.log(userNotes);
      setUserNotes(notes as Note[]);
    };

    fetchAllUserNotes();
  }, [user]);

  return (
    <div
      className={cn(
        "w-[240px] h-[94vh] top-0 duration-500 transition-all bg-foreground rounded-2xl absolute right-[780px] opacity-0 -z-20 p-4",
        open && "opacity-100 space-y-2"
      )}
    >
      <button className="border border-secondary p-2 rounded-xl w-full flex items-center justify-center text-white text-sm">
        <Image
          src="/assets/images/gemini-icon.png"
          width={32}
          height={32}
          alt="Gemini Icon"
          className="mr-2"
        />
        Chat with Gemini
      </button>

      <button className="border border-secondary hover:bg-primary p-2 rounded-xl w-full flex items-center justify-center text-white text-sm ">
        <GalleryVerticalEnd className="mr-2" />
        Chat with All Notes
      </button>

      <div className="pt-4">
        <p className="text-white text-md">Select a note</p>
        <p className="text-xs text-white/30">
          You can select a specific chat to talk about with associated note.
        </p>
      </div>

      <div className="space-y-2">
        {userNotes.length === 0 && (
          <p className="text-white/30 text-sm text-center">There is no item.</p>
        )}
        {userNotes.map((note) => (
          <button
            className={cn(
              "border border-secondary hover:bg-primary p-2 rounded-xl w-full flex items-center justify-center text-white text-xs",
              currentNote && currentNote.id === note.id && "bg-secondary"
            )}
            onClick={() => setCurrentNote(note)}
          >
            {note.title.length > 25
              ? note.title.slice(0, 25) + "..."
              : note.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AIChatSelection;

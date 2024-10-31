"use client";

import { getAllUserNotes } from "@/actions/notes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Note } from "@prisma/client";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { BookUser, GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface AIChatSelectionProps {
  open: boolean;
  currentNote: Note;
  setCurrentNote: Dispatch<SetStateAction<Note | undefined>>;
  chatSelection: string;
  setChatSelection: Dispatch<SetStateAction<string>>;
}

const AIChatSelection: React.FC<AIChatSelectionProps> = ({
  open,
  currentNote,
  setCurrentNote,
  setChatSelection,
  chatSelection,
}) => {
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    setIsLoading(true);
    if (user && open) {
      const fetchAllUserNotes = async () => {
        const notes = await getAllUserNotes(user?.id as string);
        if (notes) {
          setUserNotes(notes as Note[]);
          setIsLoading(false);
        }
      };

      fetchAllUserNotes();
    }
  }, [user, open]);

  const handleSingleNote = (note: Note) => {
    setChatSelection("single");
    setCurrentNote(note);
  };

  return (
    <div
      className={cn(
        "w-[240px] top-0 border-2 border-primary duration-500 h-0 overflow-hidden -translate-y-16 transition-all bg-foreground rounded-2xl absolute right-[780px] opacity-0 -z-10 p-4",
        open && "opacity-100 space-y-2 h-[94vh] translate-y-0"
      )}
    >
      <button
        className={cn(
          "border border-primary hover:bg-primary relative p-2 rounded-xl w-full flex items-center justify-center text-white text-xs",
          chatSelection === "gemini" && "bg-primary"
        )}
        onClick={() => setChatSelection("gemini")}
      >
        <Image
          src="/assets/images/gemini-icon.png"
          width={32}
          height={32}
          alt="Gemini Icon"
          className="mr-2"
        />
        Chat with Gemini
      </button>

      <button
        className={cn(
          "border border-primary hover:bg-primary p-2 rounded-xl w-full flex items-center justify-center text-white text-xs",
          chatSelection === "public-notes" && "bg-primary"
        )}
        onClick={() => {
          setChatSelection("public-notes");
        }}
      >
        <GalleryVerticalEnd className="mr-2" />
        Chat with Public Notes
      </button>

      <button
        className={cn(
          "border border-primary hover:bg-primary p-2 rounded-xl w-full flex items-center justify-center text-white text-xs",
          chatSelection === "my-notes" && "bg-primary"
        )}
        onClick={() => setChatSelection("my-notes")}
      >
        <BookUser className="mr-2" />
        Chat with My Notes
      </button>

      <div className="pt-4">
        <p className="text-white text-md">Select a note</p>
        <p className="text-xs text-white/30">
          You can select a specific chat to talk about with associated note.
        </p>
      </div>

      <div>
        {isLoading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        ) : (
          <React.Fragment>
            {userNotes.length === 0 && (
              <p className="text-white/30 text-sm text-center">
                There is no item.
              </p>
            )}

            <ScrollArea
              className="space-y-2 h-[640px] pr-4 pb-3 "
              type="always"
            >
              {userNotes.map((note) => (
                <button
                  key={note.id}
                  className={cn(
                    "border border-primary hover:bg-primary p-2 rounded-xl w-full flex items-center justify-center text-white text-xs mt-2",
                    currentNote && currentNote.id === note.id && "bg-primary"
                  )}
                  onClick={() => handleSingleNote(note)}
                >
                  {note.title.length > 25
                    ? note.title.slice(0, 25) + "..."
                    : note.title}
                </button>
              ))}

              <Scrollbar orientation="vertical" />
            </ScrollArea>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default AIChatSelection;

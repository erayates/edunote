"use client";

import { createNote } from "@/actions/notes";
import { useUser } from "@clerk/nextjs";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

export function NewNote() {
  const { user } = useUser();
  const router = useRouter();

  const user_id = user?.id || "";

  const createNewNote = async () => {
    const note = await createNote(user_id);
    if (note) {
      router.push("/notes/" + note.slug);
      router.refresh();
      toast.success("Note created successfully.");
    }
  };

  return (
    <button
      onClick={createNewNote}
      className="w-[20px] h-[20px] p-0 bg-foreground border-none flex items-center text-white/30 text-xs mb-3"
    >
        <PlusCircle className="text-white/30 hover:text-white/70 transition-all duration-200" />
    </button>
  );
}

export default NewNote;
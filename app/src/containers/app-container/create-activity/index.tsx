"use client";

import { createNote } from "@/actions/notes";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@clerk/nextjs";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

export function CreateActivity() {
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
    <div className="grid grid-cols-3 gap-6 w-full">
      <button
        onClick={createNewNote}
        className="flex w-full bg-foreground flex-col py-5 items-start justify-between rounded-md border px-4 sm:flex-row sm:items-center"
      >
        <p className="text-sm font-medium leading-none">
          <span className="text-muted-foreground">Create a new note</span>
        </p>
        <PlusCircle className="text-white/30" />
      </button>

      <Tooltip>
        <TooltipTrigger asChild>
          <button className="flex w-full bg-foreground flex-col py-5 items-start justify-between rounded-md border px-4 sm:flex-row sm:items-center">
            <p className="text-sm font-medium leading-none">
              <span className="text-muted-foreground">Create a new group</span>
            </p>
            <PlusCircle className="text-white/30" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-black text-white txt-sm font-semibold">
          <p>⏳ Available Soon... ⏳</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button className="flex w-full bg-foreground flex-col py-5 items-start justify-between rounded-md border px-4 sm:flex-row sm:items-center">
            <p className="text-sm font-medium leading-none">
              <span className="text-muted-foreground">Create a new quiz</span>
            </p>
            <PlusCircle className="text-white/30" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-black text-white txt-sm font-semibold">
          <p>⏳ Available Soon... ⏳</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

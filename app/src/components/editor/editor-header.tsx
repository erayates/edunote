"use client";

import { Note } from "@prisma/client";
import EditorSettings from "./editor-settings";
import React, { ChangeEvent } from "react";

import { Input } from "../ui/input";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner";
import { updateNote } from "@/actions/notes";
import slug from "slug";
import { useRouter } from "next/navigation";

interface EditorHeaderProps {
  note: Note;
  settingsOff: boolean;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ note, settingsOff }) => {
  const { replace } = useRouter();

  const debouncedUpdates = useDebouncedCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const isTitle = e.target.name === "title";
      if (isTitle) {
        const _slug = `${slug(e.target.value)}-${note.id}`;
        const isTitleUpdated = await updateNote(note.id, {
          title: e.target.value,
          slug: _slug,
        });

        if (isTitleUpdated) {
          toast.success("Updated successfully.");
          replace(`/notes/${_slug}`);
        }
        return;
      }

      const isUpdated = await updateNote(note.id, {
        [e.target.name]: e.target.value,
      });
      if (isUpdated) {
        toast.success(`Updated successfully.`);
        return;
      }
      toast.error("Something went wrong!");
    },
    1000
  );

  return (
    <React.Fragment>
      {!settingsOff && (
        <div className="w-full flex justify-end mb-4">
          <EditorSettings note={note} />
        </div>
      )}

      <div className="w-full space-y-4">
        <Input
          className="w-full text-4xl font-semibold text-white placeholder:text-primary border-t-0 border-l-0 border-r-0 border-b-2 pb-4 h-auto rounded-none border-primary rounded-b-2xl shadow-none focus-visible:ring-0"
          placeholder="Enter a title"
          name="title"
          readOnly={settingsOff}
          defaultValue={note.title}
          onChange={debouncedUpdates}
        />

        <Input
          className="w-full text-xl font-medium text-white placeholder:text-primary border-t-0 border-l-0 border-r-0 border-b-2 pb-4 h-auto rounded-none border-primary rounded-b-xl shadow-none focus-visible:ring-0"
          placeholder="Enter a description"
          name="description"
          readOnly={settingsOff}
          defaultValue={note.description}
          onChange={debouncedUpdates}
        />
      </div>
    </React.Fragment>
  );
};

export default EditorHeader;

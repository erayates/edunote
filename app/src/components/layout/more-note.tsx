"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Input } from "../ui/input";
import { Note } from "@prisma/client";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

export function MoreNote({ notes }: { notes: Note[] }) {
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    setFilteredNotes(notes);
  }, [notes]);

  const onSearching = (e: ChangeEvent<HTMLInputElement>) => {
    const filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(e.target.value)
    );

    setFilteredNotes(filtered);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="text-white/30 w-full mt-2 text-xs py-1"
          variant="outline"
        >
          More
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="h-screen overflow-auto">
        <SheetHeader>
          <SheetTitle className="text-white">Notes</SheetTitle>
          <SheetDescription>
            Access your own notes here. Click on the relevant note to go to it.
          </SheetDescription>
        </SheetHeader>

        <div className="grid py-4 gap-4">
          <Input
            placeholder="Search..."
            className="border-zinc-700 text-white text-xs"
            onChange={onSearching}
          />

          <div className="grid gap-4">
            {filteredNotes.length === 0 && (
              <p className="text-white/30 text-md font-medium">
                There is no item.
              </p>
            )}

            {filteredNotes.map((_note) => (
              <Link href={`/notes/${_note.slug}`} key={_note.id}>
                <div className="flex border w-full max-h-[64px] h-[64px] border-primary rounded-xl space-x-2 items-center">
                  <div className="w-16 h-full min-w-16 min-h-16 overflow-hidden relative rounded-l-2xl">
                    <Image
                      width={0}
                      height={0}
                      sizes="100vw"
                      alt="Note Thumbnail"
                      className="w-full rounded-l-2xl object-cover h-full"
                      src={
                        _note.thumbnail
                          ? _note.thumbnail
                          : "/assets/images/default-note-thumbnail.jpg"
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-white text-sm">
                      {_note.title.length > 30
                        ? _note.title.slice(0, 30) + "..."
                        : _note.title}
                    </h3>
                    <p className="text-xs text-white/30">
                      {" "}
                      {_note.description.length > 50
                        ? _note.description.slice(0, 50) + "..."
                        : _note.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

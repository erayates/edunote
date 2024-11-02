"use client";

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

export function Likes({ notes }: { notes: Note[] }) {
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
        <button
        className="group mr-2 w-5 h-5 inline-flex items-center cursor-pointer relative transition-all duration-300 ease-in-out"
        aria-pressed="false"
        >
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-none stroke-current transition-all duration-300 ease-in-out"
                >
                <path
                    className="stroke-[rgba(255,255,255,0.3)] transition-all duration-300 ease-in-out group-hover:stroke-red-500"
                    strokeWidth="2"
                    d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
                />
                </svg>
            </span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="h-screen overflow-auto">
        <SheetHeader>
          <SheetTitle className="text-white">Notes</SheetTitle>
          <SheetDescription>
            Access your favorited notes here. Click on the relevant note to go to it.
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

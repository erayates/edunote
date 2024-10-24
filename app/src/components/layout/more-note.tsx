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
import { _notes } from "@/_mocks/notes";

export function MoreNote() {
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
          />

          <div className="grid gap-4">
            {_notes.map((_note) => (
              <div
                key={String(_note._id)}
                className="flex border w-full max-h-[100px] h-[100px] border-secondary rounded-xl p-2 space-x-2 items-center"
              >
                <div className="w-16 h-full min-w-16 min-h-16 overflow-hidden relative rounded-2xl">
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    alt="Note Thumbnail"
                    className="w-full h-auto rounded-2xl object-cover"
                    src={_note.note_thumbnail}
                  />
                </div>
                <div className="col-span-2">
                  <h3 className="text-white text-sm">{_note.title}</h3>
                  <p className="text-xs text-white/30">{_note.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

import { _notes } from "@/_mocks/notes";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { BookKey } from "lucide-react";
import Image from "next/image";
import React from "react";
import NoteCard from "./note-card";

const NotesContainer: React.FC = () => {
  return (
    <div className="max-w-screen-lg space-y-6">
      <div className="flex space-x-6 ">
        <div className="bg-foreground border-2 border-secondary relative w-[150px] h-[150px] rounded-full">
          <Image
            src="/assets/images/note-icon.webp"
            alt="Note Icon"
            width={250}
            height={75}
          />
        </div>

        <div className="bg-foreground border-2 border-secondary rounded-lg p-4 relative">
          <p className="text-6xl text-white font-bold">UNLOCK YOUR KNOWLEDGE</p>
          <BookKey className="absolute right-4 top-4" size={32} color="white" />
          <p className="absolute bottom-4 right-4 text-secondary font-semibold text-right">
            Explore all public notes <br /> from the world & unlock your
            knowledge!
          </p>
        </div>
      </div>

      <div className="flex space-x-6">
        <div className="w-[280px] sticky top-4  h-fit bg-foreground border-2 border-secondary rounded-xl p-2">
          <p className="text-white/30 uppercase font-semibold text-center text-xl">
            Filters
          </p>

          <div className="rounded-full h-[1px] w-full bg-secondary my-2"></div>
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-sm text-white/30 font-medium">Tags</p>
              <Input className="focus-visible:ring-secondary text-white text-xs" />
            </div>

            <div className="space-y-1">
              <p className="text-sm text-white/30 font-medium">Author</p>
              <Input className="focus-visible:ring-secondary text-white text-xs" />
            </div>

            <div className="space-y-1">
              <p className="text-sm text-white/30 font-medium">
                Published Date
              </p>
              <DatePicker />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full space-y-6">
          <Input
            placeholder="Search - Start typing..."
            className="bg-foreground text-sm border-2 border-secondary p-4 rounded-xl h-[48px] focus-visible:ring-secondary text-white placeholder:text-secondary"
          />

          <div className="grid grid-cols-3 gap-4">
            {_notes.map((_note) => (
              <NoteCard
                key={String(_note._id)}
                thumbnailUrl={
                  "https://brnx9rsmvjqlixb6.public.blob.vercel-storage.com/note-thumbnail-ocljbibQObbWyd07Q57xus6LIYOw2v.jpg"
                }
                avatarUrl={
                  "https://brnx9rsmvjqlixb6.public.blob.vercel-storage.com/note-thumbnail-ocljbibQObbWyd07Q57xus6LIYOw2v.jpg"
                }
                title={`Lorem ipsum dolor sit amet. LoremLorem ipsum dolor sit amet. LoremLorem ipsum dolor sit amet. Lorem`}
                description={`
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Aliquid sit, expedita sapiente eveniet eum repellendus labore
                  quas eligendi nihil quam itaque accusamus autem aut commodi
                  delectus voluptas facilis? Excepturi fugiat ullam distinctio
                  minima eaque soluta eum, odio maxime, vero repellat laborum
                  sunt ducimus sint omnis quibusdam quisquam sequi voluptate
                  natus cumque, non nulla facilis iste eius. Exercitationem
                  tempora ipsam ipsum accusamus, porro reprehenderit!`}
                author="John Doe"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesContainer;

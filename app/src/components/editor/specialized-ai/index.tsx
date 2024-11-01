"use client";

import Image from "next/image";
import { Button } from "../../ui/button";
import { Note, User, Tag } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import SpecializedYoutubeIntegration from "./youtube";
import SpecializedPdfIntegration from "./pdf";
import SpecializedImageFile from "./image";
import SpecializedAudioIntegration from "./audio";

interface SpecializedAIProps {
  note: Note & {
    user: User;
    tags: Tag[];
  };
  settingsOff?: boolean;
}

const SpecializedAI: React.FC<SpecializedAIProps> = ({ note }) => {
  return (
    <div className="fixed bottom-0 ml-8 mb-8 z-50">
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative w-24 h-24 flex items-center justify-center cursor-pointer">
            <svg
              className="absolute w-full h-full animate-spin-slow"
              viewBox="0 0 100 100"
            >
              <defs>
                <path
                  id="circle"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                />
              </defs>
              <text fill="white" fontSize="14">
                <textPath href="#circle" className="font-bold">
                  SPECIALIZED AI MOD • CLICK ON IT! • SPECIALIZED AI MOD • CLICK
                  ON IT! •
                </textPath>
              </text>
            </svg>
            <Button className="bg-[url('/assets/images/bg-button-ai.png')] bg-cover bg-center relative z-10 rounded-full w-16 h-16 border-2 border-sky-200">
              <Image
                src="/assets/images/button-ai.png"
                alt="Generative AI"
                width={48}
                height={48}
                className="absolute inset-0 m-auto transition-transform duration-3000 ease-in-out hover:rotate-[2400deg] transform-gpu"
              />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:max-w-[820px]  bg-foreground flex rounded-3xl p-1 border-2 border-primary">
          <DialogHeader className="h-[425px] bg-aiButtonGradient w-[320px] relative flex justify-end items-end p-6 rounded-l-3xl -mt-[6px] -mb-[6px] -ml-2">
            <h3 className="text-white font-extrabold uppercase text-6xl text-left">
              Special AI Mod
            </h3>

            <p className="text-white/30 font-medium">
              Make your notes even more powerful using specialized AI
              integrations.
            </p>
          </DialogHeader>
          <div className="py-4 pl-4 pr-12 grid grid-cols-2 gap-4">
            <SpecializedYoutubeIntegration note={note} />
            <SpecializedPdfIntegration note={note} />
            <SpecializedImageFile note={note} />
            <SpecializedAudioIntegration note={note} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpecializedAI;

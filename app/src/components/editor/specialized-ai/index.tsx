"use client";

import Image from "next/image";
import { Button } from "../../ui/button";
import { Note, User, Tag } from "@prisma/client";
import { getRandomImageSet } from "@/lib/helpers";

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
import { useEffect, useRef, useState } from "react";

interface SpecializedAIProps {
  note: Note & {
    user: User;
    tags: Tag[];
  };
  settingsOff?: boolean;
}

const SpecializedAI: React.FC<SpecializedAIProps> = ({ note }) => {
  const [imageSet, setImageSet] = useState({ background: '', eye: '' });
  const specializedAIRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const selectedImageSet = getRandomImageSet();
    setImageSet(selectedImageSet);

    const cursorEyeMove = (e: MouseEvent) => {
      if (specializedAIRef && specializedAIRef.current) {
        const rect = specializedAIRef.current.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const distanceX = (e.pageX - x) / 320;
        const distanceY = (e.pageY - y) / 320;
        const yOffset = -4;
        const adjustedDistanceY = distanceY + yOffset;

        specializedAIRef.current.style.transform = `translate(${distanceX}px, ${adjustedDistanceY}px)`;
      }
    };

    document.addEventListener("mousemove", cursorEyeMove);
    return () => document.removeEventListener("mousemove", cursorEyeMove);
  }, []);

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
              <text fill="white" fontSize="6" fontStyle="italic">
                <textPath href="#circle" className="font-bold">
                  {/* SPECIALIZED AI MOD • CLICK ON IT! • SPECIALIZED AI MOD • CLICK
                  ON IT! • Ufak bir şaka üzülme*/}
                  One Ring to rule them all, One Ring to find them, One Ring to
                  bring them all and in the darkness bind them...
                </textPath>
              </text>
            </svg>
            <Button
              className={`relative z-10 rounded-full w-16 h-16 border-4 border-stone-900 shadow-inner bg-cover bg-center`}
              style={{ backgroundImage: `url(${imageSet.background})` }} // Set the background image dynamically
            >
              <div
                ref={specializedAIRef}
                className="absolute inset-0 flex justify-center items-center"
              >
                <Image
                  src={imageSet.eye}  // Set the eye image dynamically
                  alt="Generative AI"
                  width={40}
                  height={40}
                  className={imageSet.eye === "/assets/images/button-ai.png" ? "hover:animate-spin-slow" : ""}
                />
              </div>
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-lg sm:max-w-[425px] md:max-w-[820px]  bg-foreground flex rounded-3xl p-1 border-2 border-primary">
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

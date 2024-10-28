"use client";

import { ModeToggle } from "../theme-toggle";
import { Bell, MessageCircle } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import Image from "next/image";
import { Input } from "../ui/input";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import AIChat from "./chat";

const AppBottomBar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  const chatRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  const handleOpenWithKey = (e: KeyboardEvent) => {
    if (e.code === "Backquote") {
      setOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    document.addEventListener("keypress", handleOpenWithKey);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keypress", handleOpenWithKey);
    };
  }, []);

  const handleInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setOpen(true);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  return (
    <div
      className={cn(
        "absolute inset-0 top-0 left-0  ease-linear transition-all duration-500 z-50 w-screen h-fit",
        open && "bg-black/70 backdrop-blur-sm z-50 h-screen w-screen"
      )}
    >
      <div
        ref={chatRef}
        className="absolute flex flex-col right-12 top-8 rounded-3xl space-x-4 max-w-[780px] z-50 "
      >
        <div className="flex items-center py-2 rounded-3xl bg-foreground relative pl-4 -right-6 z-30">
          <Input
            className="w-[480px] border-none text-sm placeholder:text-secondary placeholder:font-medium text-white bg-transparent focus-visible:ring-0"
            placeholder={`Press "TAB" or on focus to chat with Gemini AI about your note...`}
            onKeyUp={handleInputEnter}
            onChange={handleInputChange}
            value={prompt}
            onFocus={() => setOpen(true)}
          />

          <div className="w-[72px] h-[72px] absolute right-48 -top-2 rounded-full grid place-items-center bg-foreground border-4 border-background ">
            <Image
              src="/assets/images/magic-wand.png"
              width={28}
              height={28}
              sizes="100vw"
              alt=""
            />
          </div>

          <div className="flex items-center ml-28 pr-6">
            <ModeToggle />

            <Button
              variant="outline"
              className="w-10 h-10 text-xs text-secondary rounded-full bg-foreground border-none px-2 hover:text-white duration-300 transition-all "
            >
              <Bell size={24} />
            </Button>

            <Button
              variant="outline"
              className="w-10 h-10 text-xs text-secondary rounded-full bg-foreground border-none px-2 hover:text-white duration-300 transition-all "
            >
              <MessageCircle size={24} />
            </Button>

            <UserButton />
          </div>
        </div>

        <AIChat open={open} prompt={prompt} />
      </div>
    </div>
  );
};

export default AppBottomBar;

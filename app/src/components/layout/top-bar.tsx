"use client";

import { ModeToggle } from "../theme-toggle";
import { Bell, MessageCircle } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import Image from "next/image";
import { Input } from "../ui/input";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import AIChat from "./chat";
import { GEMINI_API_SEARCH_URL, GEMINI_API_URL } from "@/lib/constants";
import useFetchStream from "@/hooks/use-fetch-stream";
import { Note } from "@prisma/client";
import { getChatHistory } from "@/lib/service";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export interface Chat {
  role: string;
  parts: string[];
}

const initialChat: Chat[] = [
  {
    role: "model",
    parts: [
      "Welcome to the Edunote Gemini AI Chat.",
      "You can start to with AI quickly.",
      "You have lots of option to with AI like conversional chat with AI (click Chat with Gemini button), chat with AI about all your notes (click associated button) or you can chat with AI about your specific note. (select one of them)",
    ],
  },
];

const AppBottomBar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [keysPressed, setKeysPressed] = useState(new Set<string>());
  const [prompt, setPrompt] = useState("");

  const [chat, setChat] = useState<Chat[]>(initialChat);
  const [chatSelection, setChatSelection] = useState("none");
  const [currentNote, setCurrentNote] = useState<Note>();

  const [chatHistoryLoading, setChatHistoryLoading] = useState(false);

  const { user } = useUser();

  const { completion, complete, isLoading } = useFetchStream({
    api: `${GEMINI_API_URL}`,
  });

  const {
    completion: searchCompletion,
    complete: searchComplete,
    isLoading: searchIsLoading,
  } = useFetchStream({
    api: `${GEMINI_API_SEARCH_URL}`,
  });

  const chatRef = useRef<HTMLDivElement>(null);

  const commandRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  const handleClickOutside = (e: MouseEvent) => {
    // Check if the click is outside both chatRef and commandRef
    if (
      chatRef.current &&
      !chatRef.current.contains(e.target as Node) &&
      !(e.target as HTMLElement).attributes.getNamedItem("role") &&
      (e.target as Node).nextSibling
    ) {
      setOpen(false);
    }
  };

  // Toggle chat with Ctrl + Backquote key sequence
  const handleOpenWithKey = (e: KeyboardEvent) => {
    console.log(`Key down: ${e.code}`); // Log the key pressed

    // Add the pressed key to the set
    keysPressed.add(e.code);
    setKeysPressed(new Set(keysPressed)); // Update the state
    console.log(`Current keys pressed: ${Array.from(keysPressed).join(', ')}`); // Log currently pressed keys

    // Check if the key sequence is complete
    if ((keysPressed.has("ControlLeft") && e.code === "Backquote") || e.code === "F2") {
      console.log("Toggling chat state"); // Log when toggling the chat state
      setOpen((prev) => !prev);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    console.log(`Key up: ${e.code}`); // Log the key released

    // Remove the key from the set when released
    keysPressed.delete(e.code);
    setKeysPressed(new Set(keysPressed)); // Update the state
    console.log(`Current keys pressed after release: ${Array.from(keysPressed).join(', ')}`); // Log keys after release
  };

  useEffect(() => {
    // Attach event listeners
    window.addEventListener("keydown", handleOpenWithKey);
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("keydown", handleOpenWithKey);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Handle user select a command
  const onUserSelectCommand = (option: string) => {
    complete("", {
      body: {
        option: `fromnote_${option}`,
        user_id: user?.id as string,
        note_id: currentNote?.id as string,
      },
    });

    addUserChat(
      `Im staying at my ${currentNote?.title} right now. Let's ${option} my note. ☺️`
    );
  };

  useEffect(() => {
    if (isLoading && !completion) {
      addModelChat("⏳⏳ Gemini is thinking... Please be patient... ⏳⏳");
    }

    if (completion && !isLoading) {
      setChat((prev) => prev.slice(0, -1));
      addModelChat(completion);
    }
  }, [completion, isLoading]);

  useEffect(() => {
    if (searchIsLoading && !searchCompletion) {
      addModelChat("⏳⏳ Gemini is thinking... Please be patient... ⏳⏳");
    }

    if (searchCompletion && !searchIsLoading) {
      setChat((prev) => prev.slice(0, -1));
      addModelChat(searchCompletion);
    }
  }, [searchCompletion, searchIsLoading]);

  // Set body style settings to prevent overflow
  useEffect(() => {
    if (open) {
      setPrompt("");
      document.body.style.overflow = "hidden";
      return;
    }
    document.body.style.height = "auto";
    document.body.style.overflowX = "clip";
    document.body.style.overflowY = "auto";
  }, [open]);

  // Setting keypress and mousedown events
  useEffect(() => {
    document.addEventListener("keypress", handleOpenWithKey);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keypress", handleOpenWithKey);
    };
  }, [commandRef]);

  useEffect(() => {
    if (chatSelection === "none") {
      setChat(initialChat);
    }

    if (chatSelection === "gemini") {
      setChat([]);
      addModelChat("Type something to start with Gemini AI.");
    }

    if (chatSelection === "single") {
      setChatHistoryLoading(true);
      const fetchChatHistory = async () => {
        const chatHistory = await getChatHistory(
          user?.id as string,
          currentNote?.id as string
        );
        if (chatHistory) {
          setChat(chatHistory);
          setChatHistoryLoading(false);
          return;
        }

        setChat([]);
        setChatHistoryLoading(false);
      };

      fetchChatHistory();
    }

    if (chatSelection === "public-notes") {
      setChat([]);
      addModelChat(
        "Type anything start chat with GEMINI with the knowledge of all public notes."
      );
    }

    if (chatSelection === "my-notes") {
      setChat([]);
      addModelChat(
        "Don't you remember what you note in your Science Class? Search now! Type anything to chat with GEMINI."
      );
    }
  }, [chatSelection, currentNote]);

  // Send prompt to AI
  const handleInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (chatSelection === "none") {
        return;
      }

      if (chatSelection === "gemini") {
        addUserChat(prompt);
        complete(prompt, {
          body: {
            command: prompt,
            user_id: user?.id as string,
          },
        });
      }

      if (chatSelection === "single") {
        addUserChat(prompt);
        complete(prompt, {
          body: {
            command: prompt,
            user_id: user?.id as string,
            note_id: currentNote?.id as string,
            option: "fromnote_ask",
          },
        });
      }

      if (chatSelection === "my-notes") {
        addUserChat(prompt);
        searchComplete(prompt, {
          body: {
            command: prompt,
            user_id: user?.id as string,
          },
        });
      }

      if (chatSelection === "public-notes") {
        addUserChat(prompt);
        searchComplete(prompt, {
          body: {
            command: prompt,
            user_id: user?.id as string,
            public_search: true,
          },
        });
      }

      setPrompt("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  // Add user prompt to chat
  const addUserChat = (prompt: string) => {
    setChat((prev) => [
      ...prev,
      {
        role: "user",
        parts: [prompt],
      },
    ]);
  };

  // Add modal response to chat
  const addModelChat = (prompt: string) => {
    setChat((prev) => [
      ...prev,
      {
        role: "model",
        parts: [prompt],
      },
    ]);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 top-0 left-0 ease-linear transition-all duration-500 z-20 h-fit w-screen ",
        open && "bg-black/70 backdrop-blur-sm z-50 h-full"
      )}
    >
      <div
        ref={chatRef}
        className="fixed flex flex-col right-12 top-8 rounded-3xl space-x-4 max-w-[60%]"
      >
        <div className="flex items-center py-2 rounded-3xl bg-foreground relative pl-4 -right-6 z-10  border-2 border-primary">
          <Input
            className="w-[480px] border-none text-sm placeholder:text-primary placeholder:font-medium text-white bg-transparent focus-visible:ring-0"
            placeholder={`Press "Blockquote (")" or on focus to chat with Gemini AI about your note...`}
            onKeyUp={handleInputEnter}
            onChange={handleInputChange}
            value={prompt}
            onFocus={() => setOpen(true)}
          />

          <div className="w-[72px] h-[72px] absolute right-48 -top-2 rounded-full grid place-items-center bg-foreground border-[3px] border-primary ">
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

            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="w-10 h-10 text-xs text-primary rounded-full bg-foreground border-none px-2 hover:text-white duration-300 transition-all "
                >
                  <Bell size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white txt-sm font-semibold">
                <p>⏳ Available Soon...</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="w-10 h-10 text-xs text-primary rounded-full bg-foreground border-none px-2 hover:text-white duration-300 transition-all "
                >
                  <MessageCircle size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white txt-sm font-semibold">
                <p>⏳ Available Soon...</p>
              </TooltipContent>
            </Tooltip>

            <UserButton />
          </div>
        </div>

        <AIChat
          open={open}
          setChat={setChat}
          setChatSelection={setChatSelection}
          setCurrentNote={setCurrentNote}
          chatSelection={chatSelection}
          currentNote={currentNote}
          chat={chat}
          onUserSelectCommand={onUserSelectCommand}
          chatHistoryLoading={chatHistoryLoading}
        />
      </div>
    </div>
  );
};

export default AppBottomBar;

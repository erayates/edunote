import useFetchStream from "@/hooks/use-fetch-stream";
import AIChatContent from "./chat-content";
import AIChatSelection from "./chat-selection";
import React from "react";
import { useState } from "react";
import { Note } from "@prisma/client";

export interface Chat {
  role: string;
  parts: string[];
}

const initialChat: Chat[] = [
  {
    role: "user",
    parts: [
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, consequuntur!",
      "lorem ipsum dolor sit amet",
    ],
  },
  {
    role: "model",
    parts: [
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, consequuntur!",
      "lorem ipsum dolor sit amet",
    ],
  },

  {
    role: "user",
    parts: [
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, consequuntur!",
      "lorem ipsum dolor sit amet",
    ],
  },
  {
    role: "model",
    parts: [
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, consequuntur!",
      "lorem ipsum dolor sit amet",
    ],
  },

  {
    role: "user",
    parts: [
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, consequuntur!",
      "lorem ipsum dolor sit amet",
    ],
  },
  {
    role: "model",
    parts: [
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, consequuntur!",
      "lorem ipsum dolor sit amet",
    ],
  },

  {
    role: "user",
    parts: [
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, consequuntur!",
      "lorem ipsum dolor sit amet",
    ],
  },
  {
    role: "model",
    parts: [
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, consequuntur!",
      "lorem ipsum dolor sit amet",
    ],
  },

  {
    role: "model",
    parts: [
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, consequuntur!",
      "lorem ipsum dolor sit amet",
    ],
  },

  {
    role: "user",
    parts: [
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, consequuntur!",
      "lorem ipsum dolor sit amet",
    ],
  },
];

interface AIChatProps {
  open: boolean;
  prompt: string;
}

const AIChat: React.FC<AIChatProps> = ({ open, prompt }) => {
  const [chat, setChat] = useState<Chat[]>([
    {
      role: "user",
      parts: [
        "Welcome to the Edunote Gemini AI Chat.",
        "You can start to with AI quickly.",
        "You have lots of option to with AI like conversional chat with AI (click Chat with Gemini button), chat with AI about all your notes (click associated button) or you can chat with AI about your specific note. (select one of them)",
      ],
    },
  ]);
  const [chatSelection, setChatSelection] = useState("gemini");

  const { completion, complete, isLoading } = useFetchStream({
    api: "https://btk-demo-file-634181987121.europe-central2.run.app/gemini/",
  });

  const [currentNote, setCurrentNote] = useState<Note>();

  return (
    <React.Fragment>
      <AIChatSelection
        open={open}
        currentNote={currentNote}
        setCurrentNote={setCurrentNote}
      />
      <AIChatContent
        open={open}
        chat={chat}
        currentNote={currentNote}
        setChat={setChat}
      />
    </React.Fragment>
  );
};

export default AIChat;

import AIChatContent from "./chat-content";
import AIChatSelection from "./chat-selection";
import React from "react";
import { Note } from "@prisma/client";
import { Chat } from "../bottom-bar";

interface AIChatProps {
  open: boolean;
  setChat: React.Dispatch<React.SetStateAction<Chat[]>>;
  chat: Chat[];
  setChatSelection: React.Dispatch<React.SetStateAction<string>>;
  setCurrentNote: React.Dispatch<React.SetStateAction<Note | undefined>>;
  chatSelection: string;
  currentNote: Note | undefined;
  chatHistoryLoading: boolean;
  onUserSelectCommand: (option: string) => void;
}

const AIChat: React.FC<AIChatProps> = ({
  open,
  currentNote,
  setCurrentNote,
  chatSelection,
  setChatSelection,
  chat,
  setChat,
  chatHistoryLoading,
  onUserSelectCommand,
}) => {
  return (
    <React.Fragment>
      <AIChatSelection
        open={open}
        currentNote={currentNote}
        setCurrentNote={setCurrentNote}
        setChatSelection={setChatSelection}
        chatSelection={chatSelection}
      />
      <AIChatContent
        open={open}
        chat={chat}
        setChat={setChat}
        chatSelection={chatSelection}
        chatHistoryLoading={chatHistoryLoading}
        onUserSelectCommand={onUserSelectCommand}
      />
    </React.Fragment>
  );
};

export default AIChat;

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Chat } from "../../top-bar";
import { Dispatch, SetStateAction } from "react";
import Spinner from "@/components/ui/spinner";
import ChatAICommands from "../chat-ai-commands";

import Markdown from "react-markdown";
import Link from "next/link";

interface AIChatContentProps {
  chat: Chat[];
  open: boolean;
  setChat: Dispatch<SetStateAction<Chat[]>>;
  chatHistoryLoading: boolean;
  chatSelection: string;
  onUserSelectCommand: (option: string) => void;
}

const AIChatContent: React.FC<AIChatContentProps> = ({
  chat,
  open,
  chatHistoryLoading,
  chatSelection,
  onUserSelectCommand,
}) => {
  const { user } = useUser();

  return (
    <div
      className={cn(
        "h-0 -translate-y-[4.5rem] border-2 border-primary mt-4 bg-foreground relative flex  space-y-6 w-full rounded-3xl left-2 transition-all duration-500 ease-in-out py-6 px-6 pr-2",
        open && "h-[86.5vh] translate-y-0"
      )}
    >
      {chatSelection === "single" && !chatHistoryLoading && (
        <ChatAICommands onSelect={onUserSelectCommand} />
      )}
      {chatHistoryLoading ? (
        <div className="w-full flex justify-center">
          <Spinner />
        </div>
      ) : (
        <ScrollArea className="max-h-full pr-6 w-full">
          <div
            className={cn(
              "hidden space-y-6 h-full",
              open && "block opacity-100"
            )}
          >
            {chat.length === 0 || chat === undefined ? (
              <div className="text-center font-semibold text-white flex flex-col items-center justify-center -mt-6 h-full">
                <span className="text-[96px]">😢</span>
                <span className="text-xl text-white/30 font-semibold">
                  There is no chat history. <br />
                  Start chat right now!
                </span>
              </div>
            ) : (
              chat.map((chatItem: Chat, _idx: number) =>
                chatItem.role === "user" ? (
                  <div className="flex space-x-2 w-2/3 ml-auto" key={_idx}>
                    <div className="bg-background rounded-xl p-3 max-w-[420px] ml-auto h-auto">
                      {chatItem.parts.map((message, i) => (
                        <span
                          key={i}
                          className="text-white text-sm leading-6 text-pretty"
                        >
                          {message}
                        </span>
                      ))}
                    </div>
                    <Avatar className="border-2 border-gray-700">
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback className="w-full grid place-items-center bg-background text-white/30 text-md">
                        U
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ) : (
                  <div className="flex space-x-2 w-2/3 mr-auto" key={_idx}>
                    <Avatar className="">
                      <AvatarImage src="/assets/images/gemini-icon.png" />
                      <AvatarFallback className="w-full grid place-items-center bg-background text-white/30 text-md">
                        M
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-blue-600 rounded-xl p-3">
                      {chatItem.parts.map((message: string, i) => {
                        try {
                          const parsedMessage: {
                            response: string;
                            answer_found_in_the_notes_with_these_note_slugs: string[];
                          } = JSON.parse(message);
                          return (
                            <div
                              key={i}
                              className="prose p-3 px-4 prose-sm prose-h2:text-white prose-h1:text-white prose-p:text-white prose-a:text-blue-500 prose-a:no-underline prose-strong:text-white text-white"
                            >
                              <Markdown>{parsedMessage.response}</Markdown>

                              <p className="text-sm text-white font-semibold">
                                Associated Notes:
                              </p>
                              {parsedMessage
                                .answer_found_in_the_notes_with_these_note_slugs
                                .length > 0 &&
                                parsedMessage.answer_found_in_the_notes_with_these_note_slugs.map(
                                  (note: string) => (
                                    <Link
                                      href={`/notes/${note}`}
                                      key={note}
                                      className="text-sm text-white font-semibold bg-foreground p-2 rounded-sm"
                                    >
                                      {note}
                                    </Link>
                                  )
                                )}
                            </div>
                          );
                        } catch {
                          return (
                            <div
                              key={i}
                              className="prose p-2 px-4 prose-sm prose-h2:text-white prose-h1:text-white prose-p:text-white prose-a:text-blue-500 prose-a:no-underline prose-strong:text-white text-white"
                            >
                              <Markdown>{message}</Markdown>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                )
              )
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      )}
    </div>
  );
};

export default AIChatContent;

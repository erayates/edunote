import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Chat } from "..";
import { Note } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect } from "react";

interface AIChatContentProps {
  chat: Chat[];
  open: boolean;
  currentNote: Note;
  setChat: Dispatch<SetStateAction<Chat[]>>;
}

const AIChatContent: React.FC<AIChatContentProps> = ({
  chat,
  open,
  currentNote,
  setChat,
}) => {
  const { user } = useUser();

  useEffect(() => {
    if (currentNote) {
      const fetchChatHistory = async () => {
        const response = await fetch(
          `https://btk-demo-file-01-634181987121.europe-central2.run.app/chat/history/?user_id=${
            user?.id as string
          }&note_id=${currentNote.id}`
        );

        const chatHistory = await response.json();

        setChat(chatHistory);
      };

      fetchChatHistory();
    }
  }, [currentNote]);

  return (
    <div
      className={cn(
        "h-0 -translate-y-16 mt-4 bg-foreground relative flex  space-y-6 w-full rounded-3xl left-2 transition-all duration-500 ease-in-out py-6 px-6 pr-2",
        open && "h-[86.5vh] translate-y-0"
      )}
    >
      <ScrollArea className="max-h-full pr-6 w-full">
        <div className={cn("hidden space-y-6 ", open && "block opacity-100")}>
          {chat.length === 0 ? (
            <p className="text-center font-semibold text-2xl text-white">
              There is no chat history. Start chat right now!
            </p>
          ) : (
            chat.map((chatItem: Chat, _idx: number) =>
              chatItem.role === "user" ? (
                <div className="flex space-x-2 w-2/3 ml-auto" key={_idx}>
                  <div className="bg-background rounded-xl p-2 ml-auto">
                    {chatItem.parts.map((message, i) => (
                      <span key={i} className="text-white text-sm leading-6">
                        {message}
                      </span>
                    ))}
                  </div>
                  <Avatar className="border-2 border-gray-700 ">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback className="w-full grid place-items-center bg-background text-white/30 text-md">
                      U
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <div className="flex space-x-2 w-2/3 mr-auto" key={_idx}>
                  <Avatar className="border-2 border-blue-600 ">
                    <AvatarImage src="#" />
                    <AvatarFallback className="w-full grid place-items-center bg-background text-white/30 text-md">
                      M
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-blue-600 rounded-xl p-2">
                    {chatItem.parts.map((message, i) => (
                      <span key={i} className="text-white text-sm leading-6">
                        {message}
                      </span>
                    ))}
                  </div>
                </div>
              )
            )
          )}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};

export default AIChatContent;

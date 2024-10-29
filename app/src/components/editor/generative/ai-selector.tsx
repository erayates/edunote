"use client";

import { Command, CommandInput } from "@/components/ui/command";

import { ArrowUp } from "lucide-react";
import { useEditor } from "novel";
import { addAIHighlight } from "novel/extensions";
import { useState } from "react";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import CrazySpinner from "@/components/ui/icons/crazy-spinner";
import Magic from "@/components/ui/icons/magic";
import { ScrollArea } from "@/components/ui/scroll-area";
import AICompletionCommands from "./ai-completion-commands";
import AISelectorCommands from "./ai-selector-commands";
import { useUser } from "@clerk/nextjs";
import useFetchStream from "@/hooks/use-fetch-stream";
import { GEMINI_API_URL } from "@/lib/constants";

interface AISelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AISelector({ onOpenChange }: AISelectorProps) {
  const { editor } = useEditor();
  const [inputValue, setInputValue] = useState("");

  const { user } = useUser();

  const { completion, complete, isLoading } = useFetchStream({
    api: GEMINI_API_URL as string,
  });

  const hasCompletion = completion.length > 0;

  return (
    <Command className="w-[350px] bg-foreground">
      {hasCompletion && (
        <div className="flex max-h-[400px]">
          <ScrollArea>
            <div className="prose p-2 px-4 prose-sm prose-h2:text-white prose-h1:text-white prose-p:text-white prose-a:text-blue-500 prose-a:no-underline prose-strong:text-white text-white">
              <Markdown>{completion}</Markdown>
            </div>
          </ScrollArea>
        </div>
      )}

      {isLoading && (
        <div className="flex h-12 w-full items-center px-4 text-sm font-medium text-muted-foreground text-purple-500">
          <Magic className="mr-2 h-4 w-4 shrink-0  " />
          AI is thinking
          <div className="ml-2 mt-1">
            <CrazySpinner />
          </div>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="relative">
            <CommandInput
              value={inputValue}
              onValueChange={setInputValue}
              autoFocus
              placeholder={
                hasCompletion
                  ? "Tell AI what to do next"
                  : "Ask AI to edit or generate..."
              }
              onFocus={() => editor && addAIHighlight(editor)}
            />

            <Button
              size="icon"
              className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-purple-500 hover:bg-purple-900"
              onClick={() => {
                if (completion)
                  return complete(completion, {
                    body: {
                      option: "zap",
                      command: inputValue,
                      user_id: user?.id,
                    },
                  }).then(() => setInputValue(""));

                const slice = editor?.state.selection.content();
                const text = editor?.storage.markdown.serializer.serialize(
                  slice?.content
                );

                complete(text, {
                  body: {
                    option: "zap",
                    command: inputValue,
                    prompt: "",
                    user_id: user?.id,
                  },
                }).then(() => setInputValue(""));
              }}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>

          {hasCompletion ? (
            <AICompletionCommands
              onDiscard={() => {
                if (editor) editor.chain().unsetHighlight().focus().run();
                onOpenChange(false);
              }}
              completion={completion}
            />
          ) : (
            <AISelectorCommands
              onSelect={(value, option) => {
                complete(value, {
                  body: { option, user_id: user?.id as string, prompt: value },
                });
              }}
            />
          )}
        </>
      )}
    </Command>
  );
}

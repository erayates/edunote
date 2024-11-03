"use client";

import {
  CommandGroup,
  CommandSeparator,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEditor } from "novel";
import { Check, TextQuote, TrashIcon } from "lucide-react";

const AICompletionCommands = ({
  completion,
  onDiscard,
}: {
  completion: string;
  onDiscard: () => void;
}) => {
  const { editor } = useEditor();
  return (
    <>
      <CommandGroup>
        <CommandList>
          <CommandItem
            className="gap-2 px-4 text-white/30"
            value="replace"
            onSelect={() => {
              if (editor) {
                const selection = editor?.view.state.selection;
                editor
                  .chain()
                  .focus()
                  .insertContentAt(
                    {
                      from: selection.from,
                      to: selection.to,
                    },
                    completion
                  )
                  .run();
              }
            }}
          >
            <Check className="h-4 w-4 text-muted-foreground" />
            Replace selection
          </CommandItem>
          <CommandItem
            className="gap-2 px-4 text-white/30"
            value="insert"
            onSelect={() => {
              if (editor) {
                const selection = editor.view.state.selection;
                editor
                  .chain()
                  .focus()
                  .insertContentAt(selection.to + 1, completion)
                  .run();
              }
            }}
          >
            <TextQuote className="h-4 w-4 text-muted-foreground" />
            Insert below
          </CommandItem>
        </CommandList>
      </CommandGroup>
      <CommandSeparator />

      <CommandGroup>
        <CommandList>
          <CommandItem
            onSelect={onDiscard}
            value="thrash"
            className="gap-2 px-4 text-white/30"
          >
            <TrashIcon className="h-4 w-4 text-muted-foreground" />
            Discard
          </CommandItem>
        </CommandList>
      </CommandGroup>
    </>
  );
};

export default AICompletionCommands;

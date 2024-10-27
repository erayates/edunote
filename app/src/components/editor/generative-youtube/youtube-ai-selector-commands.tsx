"use client";

import {
  ChartNoAxesGantt,
  LetterText,
  Speech,
  StepForward,
  StickyNote,
} from "lucide-react";
import { useEditor } from "novel";
import { getPrevText } from "novel/utils";

import {
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const options = [
  {
    value: "summarize",
    label: "Summarize text",
    icon: ChartNoAxesGantt,
  },

  {
    value: "explain",
    label: "Explain text",
    icon: Speech,
  },

  {
    value: "note",
    label: "Take notes",
    icon: StickyNote,
  },

  {
    value: "caption",
    label: "Get caption",
    icon: LetterText,
  },
];

interface AISelectorCommandsProps {
  onSelect: (value: string, option: string) => void;
}

const YoutubeAISelectorCommands = ({ onSelect }: AISelectorCommandsProps) => {
  const { editor } = useEditor();

  return (
    <>
      <CommandGroup heading="Edit or review selection">
        <CommandList className="text-white/30">
          {options.map((option) => (
            <CommandItem
              onSelect={(value) => {
                if (editor) {
                  const slice = editor.state.selection.content();
                  const text = editor.storage.markdown.serializer.serialize(
                    slice.content
                  );
                  onSelect(text, value);
                }
              }}
              className="flex gap-2 px-4 cursor-pointer"
              key={option.value}
              value={option.value}
            >
              <option.icon className="h-4 w-4 text-purple-500" />
              {option.label}
            </CommandItem>
          ))}
        </CommandList>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Use AI to do more">
        <CommandList>
          <CommandItem
            onSelect={() => {
              if (editor) {
                const pos = editor.state.selection.from;
                const text = getPrevText(editor, pos as number);
                onSelect(text, "continue");
              }
            }}
            value="continue"
            className="gap-2 px-4 cursor-pointer text-white/30"
          >
            <StepForward className="h-4 w-4 text-purple-500" />
            Continue writing
          </CommandItem>
        </CommandList>
      </CommandGroup>
    </>
  );
};

export default YoutubeAISelectorCommands;

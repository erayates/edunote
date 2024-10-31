"use client";

import {
  ArrowDownWideNarrow,
  ChartNoAxesGantt,
  CheckCheck,
  LayoutTemplate,
  RefreshCcwDot,
  Speech,
  StepForward,
  StickyNote,
  WrapText,
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
    value: "improve",
    label: "Improve writing",
    icon: RefreshCcwDot,
  },

  {
    value: "fix",
    label: "Fix grammar",
    icon: CheckCheck,
  },

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
    value: "template",
    label: "Template it",
    icon: LayoutTemplate,
  },

  {
    value: "shorter",
    label: "Make shorter",
    icon: ArrowDownWideNarrow,
  },
  {
    value: "longer",
    label: "Make longer",
    icon: WrapText,
  },
];

interface AISelectorCommandsProps {
  onSelect: (value: string, option: string) => void;
}

const AISelectorCommands = ({ onSelect }: AISelectorCommandsProps) => {
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
              className="flex gap-2 px-4 cursor-pointer rounded-xl"
              key={option.value}
              value={option.value}
            >
              <option.icon className="h-4 w-4 text-red-500" />
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
            className="gap-2 px-4 cursor-pointer text-white/30 rounded-xl"
          >
            <StepForward className="h-4 w-4 text-red-500 " />
            Continue writing
          </CommandItem>
        </CommandList>
      </CommandGroup>
    </>
  );
};

export default AISelectorCommands;

"use client";

import {
  ArrowDownWideNarrow,
  ChartNoAxesGantt,
  CheckCheck,
  LayoutTemplate,
  RefreshCcwDot,
  Settings2,
  Speech,
  StickyNote,
  WrapText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const options = [
  {
    value: "improve",
    label: "Improve note",
    icon: RefreshCcwDot,
  },

  {
    value: "fix",
    label: "Fix note grammar",
    icon: CheckCheck,
  },

  {
    value: "summarize",
    label: "Summarize note",
    icon: ChartNoAxesGantt,
  },

  {
    value: "explain",
    label: "Explain note",
    icon: Speech,
  },

  {
    value: "note",
    label: "Take notes",
    icon: StickyNote,
  },

  {
    value: "template",
    label: "Template note",
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

interface ChatAICommandsProps {
  onSelect: (option: string) => void;
}

const ChatAICommands = ({ onSelect }: ChatAICommandsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="absolute top-2 left-2 rounded-full"
      >
        <Button variant="outline" className="text-white">
          <Settings2 size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-foreground z-50">
        <DropdownMenuLabel>Select a command:</DropdownMenuLabel>

        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuItem
            onClick={() => {
              onSelect(option.value);
            }}
            className="flex gap-2 px-4 cursor-pointer"
            key={option.value}
          >
            <option.icon className="h-4 w-4 text-purple-500" />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChatAICommands;

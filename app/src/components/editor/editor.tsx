"use client";
import { defaultEditorContent } from "@/lib/content";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  type JSONContent,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { defaultExtensions } from "./extensions";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { NodeSelector } from "./selectors/node-selector";
import { MathSelector } from "./selectors/math-selector";
import { TextButtons } from "./selectors/text-buttons";
import { Separator } from "../ui/separator";

import { handleImageDrop, handleImagePaste } from "novel/plugins";
import GenerativeMenuSwitch from "./generative/generate-menu-switch";
import { uploadFn } from "./image-upload";

import { slashCommand, suggestionItems } from "./slash-commands";

// import hljs from "highlight.js";
// import { checkImageDeleted } from "@/actions/blob";
import { Note, User } from "@prisma/client";
import EditorHeader from "./editor-header";
import { updateNote } from "@/actions/notes";
import { toast } from "sonner";
import Image from "next/image";

const extensions = [...defaultExtensions, slashCommand];

interface EdunoteEditorProps {
  note: Note & {
    user: User;
  };
  settingsOff?: boolean;
}

const EdunoteEditor: React.FC<EdunoteEditorProps> = ({ note, settingsOff }) => {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(
    null
  );
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState();

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  //Apply Codeblock Highlighting on the HTML from editor.getHTML()
  // const highlightCodeblocks = (content: string) => {
  //   const doc = new DOMParser().parseFromString(content, "text/html");
  //   doc.querySelectorAll("pre code").forEach((el) => {
  //     https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightelement
  //     hljs.highlightElement(el as HTMLElement);
  //   });
  //   return new XMLSerializer().serializeToString(doc);
  // };

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();

      // const images =
      //   json.content
      //     ?.filter((contentItem) => contentItem.type === "image")
      //     .map((item) => item.attrs?.src) ?? [];

      // checkImageDeleted(images);

      setCharsCount(editor.storage.characterCount.words());
      const isUpdated = await updateNote(note.id, {
        content: JSON.stringify(json),
      });

      if (isUpdated) {
        setSaveStatus("Saved");
        return;
      }

      toast.error("Something went wrong when updating note!");
    },
    500
  );

  useEffect(() => {
    if (note) setInitialContent(JSON.parse(note.content));
    else setInitialContent(defaultEditorContent);
  }, [note]);

  if (!initialContent) return null;

  return (
    <React.Fragment>
      <div className="w-full h-[200px] mb-20 absolute left-0 top-0 -z-10">
        <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-t z-10 from-background to-transparent"></div>
        <div className="w-full h-full relative">
          <Image
            src={note.thumbnail ?? "/assets/images/default-note-thumbnail.jpg"}
            alt={note.description}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-full object-cover z-0 opacity-50"
          />
        </div>
      </div>

      <EditorHeader note={note} settingsOff={settingsOff as boolean} />
      <div className="relative w-full mt-12">
        <div className="flex absolute -top-12 right-0 z-10 mb-5 gap-2">
          <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground text-center">
            {saveStatus}
          </div>
          <div
            className={
              charsCount
                ? "rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground text-center"
                : "hidden"
            }
          >
            {charsCount} Words
          </div>
        </div>
        <EditorRoot>
          <EditorContent
            initialContent={initialContent}
            immediatelyRender={false}
            extensions={extensions}
            editable={!settingsOff}
            className="relative min-h-[500px] w-full border-muted bg-transparent sm:mb-[calc(20vh)] sm:rounded-lg text-white"
            editorProps={{
              handleDOMEvents: {
                keydown: (_view, event) => handleCommandNavigation(event),
              },
              handlePaste: (view, event) =>
                handleImagePaste(view, event, uploadFn),

              handleDrop: (view, event, _slice, moved) =>
                handleImageDrop(view, event, moved, uploadFn),
              attributes: {
                class:
                  "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
              },
            }}
            onUpdate={({ editor }) => {
              debouncedUpdates(editor);
              setSaveStatus("Unsaved");
            }}
            slotAfter={<ImageResizer />}
          >
            <EditorCommand className="z-50 h-auto max-h-[330px] bg-foreground overflow-y-auto rounded-md border border-muted px-1 py-2 shadow-md transition-all">
              <EditorCommandEmpty className="px-2 text-muted-foreground">
                No results
              </EditorCommandEmpty>
              <EditorCommandList>
                {suggestionItems.map((item) => (
                  <EditorCommandItem
                    value={item.title}
                    onCommand={(val) => item.command?.(val)}
                    className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                    key={item.title}
                  >
                    <div className="flex h-10 w-10 items-center text-white justify-center rounded-md border border-muted bg-background">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </EditorCommandItem>
                ))}
              </EditorCommandList>
            </EditorCommand>

            <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
              <Separator orientation="vertical" />
              <NodeSelector open={openNode} onOpenChange={setOpenNode} />
              <Separator orientation="vertical" />

              <LinkSelector open={openLink} onOpenChange={setOpenLink} />
              <Separator orientation="vertical" />
              <MathSelector />
              <Separator orientation="vertical" />
              <TextButtons />
              <Separator orientation="vertical" />
              <ColorSelector open={openColor} onOpenChange={setOpenColor} />
            </GenerativeMenuSwitch>
          </EditorContent>
        </EditorRoot>
      </div>
    </React.Fragment>
  );
};

export default EdunoteEditor;

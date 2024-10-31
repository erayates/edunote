"use client";

import React, { useState, ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useFetchStream from "@/hooks/use-fetch-stream";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, insertAudio } from "@/lib/utils";
import { CheckCircle2, GitPullRequestArrow } from "lucide-react";
import { Note, User, Tag } from "@prisma/client";
import { updateNote } from "@/actions/notes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Markdown from "react-markdown";
import { AIThinking } from "../default";
import { GEMINI_API_FILE_EXTRACT } from "@/lib/constants";

interface SpecializedAIProps {
  note: Note & {
    user: User;
    tags: Tag[];
  };
  settingsOff?: boolean;
}

const SpecializedAudioIntegration: React.FC<SpecializedAIProps> = ({
  note,
}) => {
  const [audioFile, setAudioFile] = useState<{
    name: string;
    file: File | undefined;
    url: string;
  }>();

  const { refresh } = useRouter();
  const { completion, complete, isLoading, reset } = useFetchStream({
    api: `${GEMINI_API_FILE_EXTRACT}`,
    headers: { "Content-Type": "multipart/form-data" },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile({
        name: file.name,
        file: file,
        url: URL.createObjectURL(file),
      });
    }
  };

  const handleSummarizeAudio = async () => {
    if (audioFile?.url && audioFile?.file) {
      const formData = new FormData();
      formData.append("file", audioFile.file);

      complete(audioFile.name, {
        body: formData,
      });
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      reset();
      setAudioFile({
        name: "",
        file: undefined,
        url: "",
      });
      //   refresh();
    }
  };

  const handleInsertToNote = async () => {
    const editedContent = insertAudio(note.content, completion);

    const isNoteUpdated = await updateNote(note.id, {
      content: {
        set: editedContent,
      },
    });

    if (isNoteUpdated) {
      toast.success("Audio summarize added to your note successfully.");
      refresh();
      return;
    }

    toast.error("Something went wrong!");
  };

  return (
    <Dialog onOpenChange={(open) => handleClose(open)}>
      <DialogTrigger asChild>
        <Button className="h-fit bg-foreground w-auto flex flex-col items-start p-4 border border-primary">
          <div className="w-16 h-16 relative">
            <Image
              src="/assets/images/logos/audio.webp"
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto"
            />
          </div>

          <p className="font-medium text-white text-sm text-wrap text-left">
            Audio Summarizer
          </p>
          <span className="text-wrap text-white/30 text-xs text-left">
            Summarize the uploaded audio and
            add it to your notes.
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "w-[480px] flex duration-500 transition-all bg-foreground p-2",
          completion && !isLoading && "w-auto max-h-[720px]"
        )}
      >
        {completion ? (
          <div className="flex flex-col space-y-2">
            <div className="pt-8">
              {audioFile?.url && (
                <audio controls className="w-full">
                  <source src={audioFile.url} type={audioFile.file?.type} />
                </audio>
              )}
            </div>
            <div className="max-w-[480px]">
              <div className="flex items-center justify-between mt-4 mb-2 border-2 border-primary p-2 rounded-lg ">
                <p className="text-white font-medium text-xl">Summary</p>
                <Button
                  variant="outline"
                  className="bg-white"
                  onClick={handleInsertToNote}
                >
                  <GitPullRequestArrow />
                  Insert
                </Button>
              </div>
              <ScrollArea className="h-[480px] rounded-lg">
                <p className="text-white bg-blue-500 rounded-lg p-2">
                  <Markdown>{completion}</Markdown>
                </p>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          </div>
        ) : !isLoading ? (
          <DialogHeader className="relative space-y-2 w-full">
            <DialogTitle className="text-3xl font-semibold text-white">
              Upload Audio
            </DialogTitle>
            <DialogDescription className="text-white/30 text-sm">
              Upload an audio, Gemini AI will summarize ait for you.
            </DialogDescription>
            <Label
              htmlFor="audio"
              className="border-2 border-primary rounded-lg text-white border-dashed w-full grid place-items-center h-[150px]"
            >
              Upload an Audio
            </Label>
            {audioFile?.file && (
              <span className="text-green-400 font-semibold flex items-center">
                <span className="w-5 h-5 mr-2 grid place-items-center">
                  <CheckCircle2 className="mr-2" />
                </span>
                <span className="mt-1">
                  File:{" "}
                  {audioFile?.name.length > 30
                    ? audioFile.name.slice(0, 30) + "..."
                    : audioFile.name}
                </span>
              </span>
            )}
            <Input
              type="file"
              id="audio"
              name="audio"
              className="hidden"
              onChange={handleFileChange}
              accept=".mp3, .wav, .aac, .m4a, .wma"
            />
            <Button
              variant="outline"
              className="bg-white w-fit ml-auto"
              onClick={handleSummarizeAudio}
            >
              Submit
            </Button>
          </DialogHeader>
        ) : (
          <AIThinking />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SpecializedAudioIntegration;

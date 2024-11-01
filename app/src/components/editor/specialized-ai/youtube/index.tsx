"use client";

import React, { useState, ChangeEvent } from "react";
import ReactPlayer from "react-player/lazy";

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
import { GEMINI_API_YOUTUBE_URL } from "@/lib/constants";
import { extractVideoId } from "@/lib/helpers";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, insertYoutube } from "@/lib/utils";
import { GitPullRequestArrow } from "lucide-react";
import { Note, User, Tag } from "@prisma/client";
import { updateNote } from "@/actions/notes";
import { toast } from "sonner";
import Markdown from "react-markdown";
import { AIThinking } from "../default";

interface SpecializedAIProps {
  note: Note & {
    user: User;
    tags: Tag[];
  };
  settingsOff?: boolean;
}

const SpecializedYoutubeIntegration: React.FC<SpecializedAIProps> = ({
  note,
}) => {
  const [videoUrl, setVideoUrl] = useState("");

  const slug = note.slug;

  const { completion, complete, isLoading, reset } = useFetchStream({
    api: `${GEMINI_API_YOUTUBE_URL}`,
  });

  const handleGetCaption = async () => {
    const videoId = extractVideoId(videoUrl);
    if (videoId) {
      await complete(videoId, {
        body: { youtube_video_id: videoId },
      });
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      reset();
      setVideoUrl("");
    }
  };

  const handleInsertToNote = async () => {
    const editedContent = insertYoutube(note.content, videoUrl, completion);

    const isNoteUpdated = await updateNote(note.id, {
      content: {
        set: editedContent,
      },
    });

    if (isNoteUpdated) {
      toast.success(
        "Youtube video and summarize added to your note successfully."
      );
      window.location.replace("/notes/" + slug);
      return;
    }

    toast.error("Something went wrong!");
  };

  return (
    <Dialog onOpenChange={(open) => handleClose(open)}>
      <DialogTrigger asChild>
        <Button className="h-fit bg-foreground w-auto flex flex-col items-start p-4 border border-primary">
          <Image
            src="/assets/images/logos/youtube.png"
            alt=""
            width={64}
            height={64}
            sizes="100vw"
            className="w-[70px] h-auto m-[8px]"
          />
          <p className="font-medium text-white text-sm text-wrap text-left">
            Youtube Summarizer
          </p>
          <span className="text-wrap text-white/30 text-xs text-left">
            Summarize any youtube video and place them in your notes quickly.
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "flex duration-500 transition-all bg-foreground border-2 border-primary max-h-[720px]"
        )}
      >
        {completion ? (
          <div className={cn("flex flex-col relative")}>
            <div className="mt-2">
              <ReactPlayer url={videoUrl} width={460} height={190} />
            </div>
            <div className="w-full">
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
              <ScrollArea className="h-[400px] rounded-lg">
                <p className="text-white bg-blue-500 rounded-lg p-2">
                  <Markdown>{completion}</Markdown>
                </p>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          </div>
        ) : !isLoading ? (
          <DialogHeader className="relative space-y-2">
            <DialogTitle className="text-3xl font-semibold text-white">
              Insert Video URL
            </DialogTitle>
            <DialogDescription className="text-white/30 text-sm">
              Enter a valid YouTube video URL that you would like to get
              summarize.
            </DialogDescription>
            <Input
              placeholder="E.g. https://www.youtube.com/watch?v=FGCmobEC9ck"
              className="border-primary placeholder:text-primary text-white focus-visible:ring-white/30"
              value={videoUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setVideoUrl(e.target.value)
              }
            />
            <Button
              variant="outline"
              className="bg-white w-fit ml-auto"
              onClick={handleGetCaption}
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

export default SpecializedYoutubeIntegration;

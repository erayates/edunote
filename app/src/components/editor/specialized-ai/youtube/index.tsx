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
import CrazySpinner from "@/components/ui/icons/crazy-spinner";
import Magic from "@/components/ui/icons/magic";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, insertYoutube } from "@/lib/utils";
import { GitPullRequestArrow } from "lucide-react";
import { Note, User, Tag } from "@prisma/client";
import { updateNote } from "@/actions/notes";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

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

  const { refresh } = useRouter();
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
      refresh();
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
      refresh();
      return;
    }

    toast.error("Something went wrong!");
  };

  return (
    <Dialog onOpenChange={(open) => handleClose(open)}>
      <DialogTrigger asChild>
        <Button className="h-fit bg-foreground w-auto flex flex-col items-start p-4 border border-secondary">
          <Image
            src="/assets/images/logos/youtube.png"
            alt=""
            width={64}
            height={64}
            sizes="100vw"
          />
          <p className="font-medium text-white text-sm text-wrap text-left">
            Youtube Video Summarizer
          </p>
          <span className="text-wrap text-white/30 text-xs text-left">
            Summarize any youtube video and place them in your notes quickly.
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "w-[480px] flex duration-500 transition-all bg-foreground",
          completion && !isLoading && "min-w-[1024px]"
        )}
      >
        {completion ? (
          <div className="flex space-x-4">
            <ReactPlayer url={videoUrl} width={480} height={480} />
            <div className="max-w-[480px]">
              <div className="flex items-center justify-between mt-4 mb-2 border-2 border-secondary p-2 rounded-lg ">
                <p className="text-white font-medium text-xl ">Summary</p>
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
                  {completion}
                </p>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          </div>
        ) : !isLoading ? (
          <DialogHeader className="relative space-y-2">
            <DialogTitle className="text-3xl font-semibold text-white">
              Get Caption
            </DialogTitle>
            <DialogDescription className="text-white/30 text-sm">
              Enter a valid YouTube video URL that you would like to get
              caption.
            </DialogDescription>
            <Input
              placeholder="E.g. https://www.youtube.com/watch?v=FGCmobEC9ck"
              className="border-secondary placeholder:text-secondary text-white focus-visible:ring-white/30"
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
          <div className="w-full items-center justify-center -ml-8 text-xl flex flex-col font-medium text-muted-foreground text-white">
            <div className="flex items-center justify-center">
              <Magic className="mr-2 h-8 w-8 shrink-0" />
              AI is thinking
            </div>
            <div className="mt-1">
              <CrazySpinner className="w-3 h-3 bg-white" />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SpecializedYoutubeIntegration;

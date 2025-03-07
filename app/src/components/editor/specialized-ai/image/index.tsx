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
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, insertImage } from "@/lib/utils";
import { CheckCircle2, GitPullRequestArrow } from "lucide-react";
import { Note, User, Tag } from "@prisma/client";
import { updateNote } from "@/actions/notes";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
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

const SpecializedImageFile: React.FC<SpecializedAIProps> = ({ note }) => {
  const [imageFile, setImageFile] = useState<{
    name: string;
    file: File | undefined;
    url: string;
  }>();

  const slug = note.slug;

  const { completion, complete, isLoading, reset } = useFetchStream({
    api: `${GEMINI_API_FILE_EXTRACT}`,
    headers: { "Content-Type": "multipart/form-data" },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile({
        name: file.name,
        file: file,
        url: URL.createObjectURL(file),
      });
    }
  };

  const handleSummarizeImage = async () => {
    if (imageFile?.url && imageFile?.file) {
      const formData = new FormData();
      formData.append("file", imageFile.file);

      await complete(imageFile.name, {
        body: formData,
      });
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      reset();
      setImageFile({
        name: "",
        file: undefined,
        url: "",
      });
    }
  };

  const handleInsertToNote = async () => {
    const editedContent = insertImage(note.content, completion);

    const isNoteUpdated = await updateNote(note.id, {
      content: {
        set: editedContent,
      },
    });

    if (isNoteUpdated) {
      toast.success("Image summarize added to your note successfully.");
      window.location.replace("/notes/" + slug);
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
              src="/assets/images/logos/image.webp"
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto"
            />
          </div>

          <p className="font-medium text-white text-sm text-wrap text-left">
            Image Summarizer
          </p>
          <span className="text-wrap text-white/30 text-xs text-left">
            Summarize the uploaded image and add it to your notes.
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "max-w-lg max-w-auto w-fit h-fit min-w-[480px] flex duration-500 transition-all bg-foreground p-6 border-2 border-primary",
          completion && !isLoading && "w-auto max-w-auto max-w-[99900px]"
        )}
      >
        {completion ? (
          <div className="flex flex-row space-y-2">
            <div className="min-w-[400px] relative">
              {imageFile?.url && (
                <Image
                  src={imageFile.url}
                  height={0}
                  width={0}
                  alt=""
                  sizes="100vw"
                  className="w-full h-full rounded-lg object-cover"
                />
              )}
            </div>
            <div className="max-w-[600px] min-w-[400px] pl-6">
              <div className="flex items-center  justify-between border border-primary p-2 rounded-lg mb-4">
                <DialogTitle className="text-white font-medium text-xl">Summary</DialogTitle>
                <Button
                  variant="outline"
                  className="bg-white"
                  onClick={handleInsertToNote}
                >
                  <GitPullRequestArrow />
                  Insert
                </Button>
              </div>
              <ScrollArea className="h-fit max-h-[500px] overflow-y-auto overflow-x-clip rounded-lg">
                <div className="text-white  bg-blue-500 rounded-lg p-3 h-full">
                  <Markdown>{completion}</Markdown>
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          </div>
        ) : !isLoading ? (
          <DialogHeader className="relative space-y-2 w-full h-full">
            <DialogTitle className="text-3xl font-semibold text-white">
              Upload Image
            </DialogTitle>
            <DialogDescription className="text-white/30 text-sm">
              Upload a image, Gemini AI will summarize ait for you.
            </DialogDescription>
            <Label
              htmlFor="image"
              className="border-2 border-primary rounded-lg text-white border-dashed w-full grid place-items-center h-[150px]"
            >
              Upload an Image
            </Label>
            {imageFile?.file && (
              <span className="text-green-400 font-semibold flex items-center">
                <span className="w-5 h-5 mr-2 grid place-items-center">
                  <CheckCircle2 className="mr-2" />
                </span>
                <span className="mt-1">
                  File:{" "}
                  {imageFile?.name.length > 30
                    ? imageFile.name.slice(0, 30) + "..."
                    : imageFile.name}
                </span>
              </span>
            )}
            <Input
              type="file"
              id="image"
              name="image"
              className="hidden"
              onChange={handleFileChange}
              accept=".jpg, .jpeg, .png, .gif, .webp, .svg"
            />
            <Button
              variant="outline"
              className="bg-white w-fit ml-auto"
              onClick={handleSummarizeImage}
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

export default SpecializedImageFile;

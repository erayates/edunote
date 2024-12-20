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
import { cn, insertPdf } from "@/lib/utils";
import { CheckCircle2, GitPullRequestArrow } from "lucide-react";
import { Note, User, Tag } from "@prisma/client";
import { updateNote } from "@/actions/notes";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import Markdown from "react-markdown";
import { GEMINI_API_FILE_EXTRACT } from "@/lib/constants";
import { AIThinking } from "../default";

interface SpecializedAIProps {
  note: Note & {
    user: User;
    tags: Tag[];
  };
  settingsOff?: boolean;
}

const SpecializedPdfIntegration: React.FC<SpecializedAIProps> = ({ note }) => {
  const [pdfFile, setPdfFile] = useState<{
    name: string;
    file: File | undefined;
    url: string;
  }>();

  const slug = note.slug;

  const [submitted, setSubmitted] = useState(false);

  const { completion, complete, isLoading, reset } = useFetchStream({
    api: `${GEMINI_API_FILE_EXTRACT}`,
    headers: { "Content-Type": "multipart/form-data" },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile({
        name: file.name,
        file: file,
        url: URL.createObjectURL(file),
      });
    }
  };

  const handleSummarizePdf = async () => {
    if (pdfFile?.url && pdfFile?.file) {
      const formData = new FormData();
      formData.append("file", pdfFile.file);

      await complete(pdfFile.name, {
        body: formData,
      });

      setSubmitted(true);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      reset();
      setPdfFile({
        name: "",
        file: undefined,
        url: "",
      });
    }
  };

  const handleInsertToNote = async () => {
    const editedContent = insertPdf(note.content, completion);

    const isNoteUpdated = await updateNote(note.id, {
      content: {
        set: editedContent,
      },
    });

    if (isNoteUpdated) {
      toast.success("PDF file and summarize added to your note successfully.");
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
              src="/assets/images/logos/pdf.png"
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto"
            />
          </div>

          <p className="font-medium text-white text-sm text-wrap text-left">
            PDF Summarizer
          </p>
          <span className="text-wrap text-white/30 text-xs text-left">
            Summarize the uploaded pdf, use it as you wish and add it to your
            notes.
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "max-w-lg flex duration-500 transition-all bg-foreground min-w-[480px] border-2 border-primary",
          submitted && "w-[1024px] max-w-max"
        )}
      >
        {completion ? (
          <div className="flex space-x-4">
            <div style={{ height: "660px" }}>
              {pdfFile?.url && (
                <iframe src={pdfFile.url} height={660} width={480} />
              )}
            </div>
            <div className="max-w-[480px]">
              <div className="flex items-center justify-between mb-2 border-2 border-primary p-2 rounded-lg ">
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
              <ScrollArea className="h-[600px] rounded-lg">
                <div className="text-white bg-blue-500 rounded-lg p-2">
                  <Markdown>{completion}</Markdown>
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          </div>
        ) : !isLoading ? (
          <DialogHeader className="relative space-y-2 w-full">
            <DialogTitle className="text-3xl font-semibold text-white">
              Upload Pdf
            </DialogTitle>
            <DialogDescription className="text-white/30 text-sm">
              Upload a pdf, Gemini AI will summarize ait for you.
            </DialogDescription>
            <Label
              htmlFor="pdf"
              className="border-2 border-primary rounded-lg text-white border-dashed w-full grid place-items-center h-[150px]"
            >
              Upload a PDF file
            </Label>
            {pdfFile?.file && (
              <span className="text-green-400 font-semibold flex items-center">
                <span className="w-5 h-5 mr-2 grid place-items-center">
                  <CheckCircle2 className="mr-2" />
                </span>
                <span className="mt-1 w-fit">
                  File:{" "}
                  {pdfFile?.name.length > 30
                    ? pdfFile.name.slice(0, 30) + "..."
                    : pdfFile.name}
                </span>
              </span>
            )}
            <Input
              type="file"
              id="pdf"
              name="pdf"
              className="hidden"
              onChange={handleFileChange}
              accept="application/pdf"
            />
            <Button
              variant="outline"
              className="bg-white w-fit ml-auto"
              onClick={handleSummarizePdf}
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

export default SpecializedPdfIntegration;

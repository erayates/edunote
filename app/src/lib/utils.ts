import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function insertYoutube(
  noteContent: string,
  videoUrl: string,
  text: string
) {
  const jsonContent = JSON.parse(noteContent);

  const youtubeContent = {
    type: "paragraph",
    content: [
      { type: "hardBreak" },
      {
        type: "youtube",
        attrs: {
          src: videoUrl,
          start: 0,
          width: 480,
          height: 480,
        },
      },
      { type: "text", text: `Youtube Summarize: ${text}` },
    ],
  };

  jsonContent.content.push(youtubeContent);

  return JSON.stringify(jsonContent);
}

export function insertPdf(noteContent: string, text: string) {
  const jsonContent = JSON.parse(noteContent);

  const pdfContent = {
    type: "paragraph",
    content: [
      { type: "hardBreak" },
      { type: "text", text: `Summarized Text: ${text}` },
    ],
  };

  jsonContent.content.push(pdfContent);

  return JSON.stringify(jsonContent);
}

export function insertImage(noteContent: string, text: string) {
  const jsonContent = JSON.parse(noteContent);

  const pdfContent = {
    type: "paragraph",
    content: [
      { type: "hardBreak" },
      { type: "text", text: `Summarized Image: ${text}` },
    ],
  };

  jsonContent.content.push(pdfContent);

  return JSON.stringify(jsonContent);
}

export function insertAudio(noteContent: string, text: string) {
  const jsonContent = JSON.parse(noteContent);

  const pdfContent = {
    type: "paragraph",
    content: [
      { type: "hardBreak" },
      { type: "text", text: `Summarized Audio: ${text}` },
    ],
  };

  jsonContent.content.push(pdfContent);

  return JSON.stringify(jsonContent);
}

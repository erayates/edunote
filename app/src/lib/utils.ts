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

  // Split text into paragraphs
  const paragraphs = text.split("\n\n");

  // Convert each paragraph into proper Tiptap structure
  const pdfContent = paragraphs.map((paragraph) => {
    // Check if it's a heading (starts with #)
    if (paragraph.startsWith("# ")) {
      return {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: paragraph.replace("# ", "") }],
      };
    } else if (paragraph.startsWith("## ")) {
      return {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: paragraph.replace("## ", "") }],
      };
    } else if (paragraph.startsWith("* ")) {
      // Handle bullet points
      return {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: paragraph.replace("* ", "") }],
              },
            ],
          },
        ],
      };
    } else {
      // Regular paragraph
      return {
        type: "paragraph",
        content: [{ type: "text", text: paragraph }],
      };
    }
  });

  jsonContent.content.push(...pdfContent);
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

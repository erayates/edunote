"use server";
import { defaultEditorContent } from "@/lib/content";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import crypto from "crypto";
import slug from "slug";

export async function createNote(userId: string) {
  // Direct note creation without user check
  const note = await prisma.note.create({
    data: {
      title: "Edunote - New Note Title",
      description: "Edunote - New Note Description",
      content: JSON.stringify(defaultEditorContent),
      isPublic: true,
      slug: "temporary-slug",
      userId: userId, // Direct assignment of Clerk user ID
    },
  });

  // Generate slug and share link
  const finalSlug = `${slug(note.title)}-${note.id}`;
  const shareLink = crypto.randomBytes(5).toString("hex");

  // Update note with final values
  return await prisma.note.update({
    where: { id: note.id },
    data: {
      slug: finalSlug,
      shareLink,
    },
  });
}

export async function fetchSingleNote(slug: string) {
  const note = await prisma.note.findFirst({
    where: {
      slug: slug,
    },
    include: {
      tags: true,
      user: true,
    },
  });

  if (note) {
    return note;
  }

  return false;
}

export async function setNoteVisibility(noteId: string, is_public: boolean) {
  try {
    await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        isPublic: is_public,
      },
    });

    return true;
  } catch {
    return false;
  }
}

export async function fetchNoteWithSharelink(shareLink: string) {
  try {
    const note = await prisma.note.findFirst({
      where: {
        shareLink,
      },
    });

    return note;
  } catch {
    return false;
  }
}

export async function getAllNotes(): Promise<
  Prisma.NoteGetPayload<{ include: { user: true } }>[] | false
> {
  try {
    const notes = await prisma.note.findMany({
      include: {
        user: true,
      },
      where: {
        isPublic: true,
      },
    });

    return notes;
  } catch {
    return false;
  }
}

export async function deleteNote(noteId: string) {
  try {
    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });

    return true;
  } catch {
    return false;
  }
}

export async function updateNote(
  noteId: string,
  data: Partial<Prisma.NoteUpdateInput>
) {
  try {
    await prisma.note.update({
      where: { id: noteId },
      data,
    });

    return true;
  } catch {
    return false;
  }
}

export async function getAllUserNotes(userId: string) {
  try {
    const userNotes = await prisma.note.findMany({
      where: {
        userId,
      },
    });

    return userNotes;
  } catch {
    return false;
  }
}

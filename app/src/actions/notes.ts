"use server";
import { defaultEditorContent } from "@/lib/content";
import { prisma } from "@/lib/db";
import { NoteWithRelations, SearchActionParams } from "@/types/note";
import { Prisma, Tag } from "@prisma/client";
import crypto from "crypto";
import { addDays, startOfDay } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
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
      include: {
        user: true,
        tags: true,
      },
    });

    return note;
  } catch {
    return false;
  }
}

export async function getAllNotes(
  take: number
): Promise<
  Prisma.NoteGetPayload<{ include: { user: true; tags: true } }>[] | false
> {
  try {
    const notes = await prisma.note.findMany({
      include: {
        user: true,
        tags: true,
      },
      take: take || 10,
      orderBy: {
        createdAt: "desc",
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
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return true;
  } catch {
    return false;
  }
}

export async function searchNotes({
  query,
  tags,
  createdAt,
  author,
  take,
}: SearchActionParams): Promise<NoteWithRelations[]> {
  const conditions: Prisma.NoteWhereInput[] = [];

  if (query) {
    conditions.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    });
  }

  if (tags) {
    const tagArray = (
      typeof tags === "string"
        ? decodeURIComponent(tags).split(",")
        : tags.map((tag) => decodeURIComponent(tag))
    ).map((tag) => tag.trim().toLowerCase());

    conditions.push({
      tags: { some: { slug: { in: tagArray } } },
    });
  }

  if (createdAt) {
    const sOfDay = fromZonedTime(startOfDay(new Date(createdAt)), "UTC");
    const eOfDay = fromZonedTime(addDays(sOfDay, 1), "UTC");

    conditions.push({
      createdAt: { gte: sOfDay, lte: eOfDay },
    });
  }

  if (author) {
    conditions.push({
      user: { fullname: { contains: author, mode: "insensitive" } },
    });
  }

  const where: Prisma.NoteWhereInput =
    conditions.length > 0 ? { AND: conditions } : {};

  return prisma.note.findMany({
    where,
    take: take || 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      tags: true,
    },
  });
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

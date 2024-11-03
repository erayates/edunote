"use server";
import { defaultEditorContent } from "@/lib/content";
import { prisma } from "@/lib/db";
import { NoteWithRelations, SearchActionParams } from "@/types/note";
import { Prisma } from "@prisma/client";
import crypto from "crypto";
import { addDays, startOfDay } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import slug from "slug";

interface SearchNotesResult {
  notes: NoteWithRelations[];
  totalNotes: number;
}

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
    // First get the note with user
    const note = await prisma.note.findFirst({
      where: {
        shareLink,
      },
      include: {
        user: true,
      },
    });

    if (!note) {
      return false;
    }

    // Then fetch the tags for the note
    const tags = await prisma.tag.findMany({
      where: {
        id: {
          in: note.tagIds || [],
        },
      },
    });

    // Combine note with tags
    const noteWithTags = {
      ...note,
      tags,
    };

    return noteWithTags;
  } catch (error) {
    console.error("Error fetching note:", error);
    return false;
  }
}

export async function getAllNotes(take: number): Promise<SearchNotesResult> {
  const notes = await prisma.note.findMany({
    include: {
      user: true,
      tags: true,
    },
    take: take || 10,
    orderBy: {
      updatedAt: "desc",
    },
    where: {
      isPublic: true,
    },
  });

  const totalNotes = await prisma.note.count();

  return { notes, totalNotes };
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
  data: Partial<Prisma.NoteUncheckedUpdateInput>
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
  page = 1,
  limit = 10,
}: SearchActionParams): Promise<SearchNotesResult> {
  const conditions: Prisma.NoteWhereInput[] = [];
  // Search by query
  if (query) {
    conditions.push({
      OR: [{ title: { contains: query, mode: "insensitive" } }],
    });
  }

  // Search by tags
  if (tags) {
    const tagIdArray = tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase()) // Trim whitespace and convert to lowercase
      .filter((tag) => tag); // Filter out any empty tags

    // Check if any tags were provided
    if (tagIdArray.length > 0) {
      conditions.push({
        tagIds: {
          hasEvery: tagIdArray,
        },
      });
    }
  }

  // Search by createdAt date
  if (createdAt) {
    const startDate = fromZonedTime(startOfDay(new Date(createdAt)), "UTC");
    const endDate = fromZonedTime(addDays(startDate, 1), "UTC");
    conditions.push({
      createdAt: { gte: startDate, lte: endDate },
    });
  }

  // Search by author
  if (author) {
    conditions.push({
      user: { fullname: { contains: author, mode: "insensitive" } },
    });
  }

  // Combine conditions
  const where: Prisma.NoteWhereInput =
    conditions.length > 0
      ? { AND: [{ isPublic: true }, ...conditions] }
      : { isPublic: true };

  try {
    // First get the notes
    const notes = await prisma.note.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { updatedAt: "desc" },
      include: {
        user: true,
      },
    });

    // Then fetch tags for each note
    const notesWithTags = await Promise.all(
      notes.map(async (note) => {
        const tags = await prisma.tag.findMany({
          where: {
            id: {
              in: note.tagIds || [], // Use the tagIds array to fetch related tags
            },
          },
        });
        return {
          ...note,
          tags,
        };
      })
    );

    const totalNotes = await prisma.note.count({ where });
    return { notes: notesWithTags, totalNotes };
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw new Error("An error occurred while fetching notes.");
  }
}

export async function getAllUserNotes(userId: string) {
  try {
    const userNotes = await prisma.note.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return userNotes;
  } catch {
    return false;
  }
}

export async function getFavoritedNotes(userId: string) {
  try {
    const favoritedNotes = await prisma.note.findMany({
      where: {
        favoritedBy: {
          some: {
            id: userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return favoritedNotes;
  } catch {
    return false;
  }
}

"use server";

import { prisma } from "@/lib/db";

export async function toggleNoteFavorite(userId: string, noteId: string) {
  try {
    const note = await prisma.note.findFirst({
      where: { id: noteId },
      select: {
        id: true,
        userId: true,
        favoritedByIds: true,
      },
    });

    if (!note) return { success: false, error: "Note not found" };

    if (note.userId === userId) {
      return { 
        success: false, 
        error: "You cannot favorite your own note" 
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        favoriteIds: true,
      },
    });

    if (!user) return { success: false, error: "User not found" };

    const isAlreadyFavorited = note.favoritedByIds.includes(userId);

    const result = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          favoriteIds: isAlreadyFavorited
            ? { set: user.favoriteIds.filter((id) => id !== noteId) }
            : { push: noteId },
        },
      }),
      prisma.note.update({
        where: { id: noteId },
        data: {
          favoritedByIds: isAlreadyFavorited
            ? { set: note.favoritedByIds.filter((id) => id !== userId) }
            : { push: userId },
        },
      }),
    ]);

    return {
      success: true,
      isFavorited: !isAlreadyFavorited,
    };
  } catch (error) {
    console.error("Toggle favorite error:", error);
    return {
      success: false,
      error: "Failed to toggle note favorite status",
    };
  }
}

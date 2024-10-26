"use server";

import { prisma } from "@/lib/db";

export async function getAllTags(
  skippedTag: number = 15
): Promise<{ value: string; label: string }[] | false> {
  try {
    const tags = await prisma.tag.findMany({
      skip: skippedTag,
      take: 15,
    });

    return tags.map((tag) => ({ value: tag.name, label: tag.name }));
  } catch {
    return false;
  }
}

export async function searchTags(search: string, skippedTag: number = 50) {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      skip: skippedTag,
      take: 15,
    });

    return tags.map((tag) => ({ value: tag.name, label: tag.name }));
  } catch {
    return false;
  }
}

"use server";

import { prisma } from "@/lib/db";
import slug from "slug";

export async function getAllTags(
  skippedTag: number = 15
): Promise<{ value: string; label: string; id: string }[] | false> {
  try {
    const tags = await prisma.tag.findMany({
      skip: skippedTag,
      take: 15,
    });

    return tags.map((tag) => ({
      id: tag.id,
      value: tag.name,
      label: tag.name,
    }));
  } catch {
    return false;
  }
}

export async function getAllTagsWithoutPartial() {
  try {
    const tags = await prisma.tag.findMany();
    return tags;
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

    return tags.map((tag) => ({
      id: tag.id,
      value: tag.name,
      label: tag.name,
    }));
  } catch {
    return false;
  }
}

export async function createTag(name: string) {
  try {
    const newTag = await prisma.tag.create({
      data: {
        name,
        slug: slug(name),
      },
    });

    return newTag;
  } catch {
    return false;
  }
}

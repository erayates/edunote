"use server";

import { prisma } from "@/lib/db";
import slug from "slug";

export async function searchTags(search: string, skip: number = 0) {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        name: "asc",
      },
      skip,
      take: 15,
    });

    return tags.map((tag) => ({
      id: tag.id,
      value: tag.name,
      label: tag.name,
    }));
  } catch (error) {
    console.error("Error searching tags:", error);
    return false;
  }
}

export async function getAllTags(skip: number = 0) {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
      skip,
      take: 15,
    });

    return tags.map((tag) => ({
      id: tag.id,
      value: tag.name,
      label: tag.name,
    }));
  } catch (error) {
    console.error("Error getting all tags:", error);
    return false;
  }
}

export async function searchSingleTag(tagId: string) {
  try {
    const tag = await prisma.tag.findUnique({
      where: {
        id: tagId,
      },
    });

    return tag;
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

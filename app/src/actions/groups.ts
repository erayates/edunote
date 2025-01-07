"use server";

import { GroupFormData } from "@/features/group/types/form";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import slug from "slug";

export async function createGroup(data: GroupFormData, userId: string) {
  try {
    const group = await prisma.group.create({
      data: {
        name: data.name,
        description: data.description,
        visibility: data.visibility ? "PUBLIC" : "PRIVATE",
        avatar: data.avatar,
        // Slugify the group name
        slug: slug(data.name),
        adminId: userId,
        settings: {
          create: {
            allowMemberPosts: data.settings.allowMemberPosts,
            allowInvites: data.settings.allowMemberInvites,
          },
        },
        members: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        settings: true,
        members: true,
      },
    });

    return { success: true, group };
  } catch (error) {
    console.error("Failed to create group:", error);
    return { error: "Failed to create group" };
  }
}

export async function searchGroups({
  query,
  page = 1,
  limit = 10,
}: {
  query: string;
  page: number;
  limit: number;
}) {
  try {
    const groups = await prisma.group.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: "desc" },
      include: {
        settings: true,
        members: true,
      },
    });

    const totalGroups = await prisma.group.count({
      where: {
        name: { contains: query, mode: "insensitive" },
      },
    });

    return { groups, totalGroups };
  } catch (error) {
    console.error("Failed to search groups:", error);
    return { error: "Failed to search groups" };
  }
}

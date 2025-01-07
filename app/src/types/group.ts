import { Prisma, GroupVisibility } from "@prisma/client";

export interface Group {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  avatar: string;
  slug: string;
  visibility: GroupVisibility;
  adminId: string;
  memberIds: string[];
  noteIds: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  settings: {
    id: string;
    allowInvites: boolean;
    allowMemberPosts: boolean;
    groupId: string;
    updatedAt: Date;
  };
}

export type GroupWithRelations = Prisma.GroupGetPayload<{
  include: {
    settings: true;
    members: {
      select: {
        id: true;
        email: true;
        username: true;
        fullname: true;
        avatar: true;
        watchedTags: true;
        role: true;
        status: true;
        groupIds: true;
        favoriteIds: true;
        lastLogin: true;
        lastActive: true;
        createdAt: true;
        updatedAt: true;
        deletedAt: true;
      }
    }
  }
}>;

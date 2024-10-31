import { Prisma } from "@prisma/client";
import { ObjectId } from "mongodb";

export interface Note {
  _id: ObjectId;
  user_id: string;
  title: string;
  description: string;
  content: string;
  is_public: boolean;
  share_link: string;
  tags: string[];
  note_thumbnail: string;
}

export interface SearchActionParams {
  query?: string;
  tags?: string[];
  createdAt?: Date;
  author?: string;
  page?: number;
  limit: number;
}

export type NoteWithRelations = Prisma.NoteGetPayload<{
  include: { user: true; tags: true };
}>;

export interface NotesResponse {
  notes: NoteWithRelations[];
  hasMore: boolean;
}

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

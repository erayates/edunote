import { ObjectId } from "mongodb";

export interface Tag {
  _id: ObjectId;
  tag_name: string;
}

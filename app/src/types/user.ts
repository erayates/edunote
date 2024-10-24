import { ObjectId } from "mongodb";

interface User {
  _id: ObjectId;
  email: string;
  full_name: string;
  nickname: string;
  tags: string[];
  note: string[];
  groups: string[];
}

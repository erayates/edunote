import { ObjectId } from "mongodb";

export interface Group {
    _id: ObjectId;
    group_name: string;
    group_description: string;
    group_image: string;
    users: string[];
    notes: string[];
    admin_id: string;
  }
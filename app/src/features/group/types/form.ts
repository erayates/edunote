import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const groupSchema = z.object({
  name: z
    .string({
      message: "Name is required.",
    })
    .min(3, "Name must be at least 3 characters"),
  description: z
    .string({
      message: "Description is required.",
    })
    .min(10, "Description must be at least 10 characters"),
  visibility: z.boolean(),
  avatar: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),

  thumbnail: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),

  settings: z.object({
    allowMemberPosts: z.boolean(),
    allowMemberInvites: z.boolean(),
  }),
});

export type GroupFormData = z.infer<typeof groupSchema>;

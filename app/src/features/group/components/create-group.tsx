"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { groupSchema, type GroupFormData } from "../types/form";
import { createGroup } from "@/actions/groups";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import CustomInput from "@/components/form-elements/input";
import { Form } from "@/components/ui/form";
import CustomTextarea from "@/components/form-elements/textarea";
import { CustomSwitch } from "@/components/form-elements/switch";
import FileInput from "@/components/form-elements/file-input";
import { onUpload } from "@/components/editor/image-upload";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function CreateGroup() {
  const { userId } = useAuth();
  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
      visibility: true,
      settings: {
        allowMemberPosts: false,
        allowMemberInvites: false,
      },
    },
  });

  const { handleSubmit } = form;

  const router = useRouter();

  const onSubmit = async (data: GroupFormData) => {
    const { avatar, thumbnail, ...rest } = data;

    try {
      // Upload status tracking
      let avatarUrl = null;
      let thumbnailUrl = null;
      const uploadErrors = [];

      // Try avatar upload
      if (avatar instanceof File) {
        try {
          avatarUrl = await onUpload(avatar);
        } catch (error) {
          console.error("Avatar upload failed:", error);
          uploadErrors.push("Avatar upload failed");
        }
      }

      // Try thumbnail upload
      if (thumbnail instanceof File) {
        try {
          thumbnailUrl = await onUpload(thumbnail);
        } catch (error) {
          console.error("Thumbnail upload failed:", error);
          uploadErrors.push("Thumbnail upload failed");
        }
      }

      if (thumbnailUrl === null || avatarUrl === null) {
        toast.error("Failed to upload images");
        return;
      }

      // Check if both uploads were successful
      if (uploadErrors.length > 0) {
        toast.error(`Upload failed: ${uploadErrors.join(", ")}`);
        return;
      }

      const groupData = {
        ...rest,
        avatar: avatarUrl,
        thumbnail: thumbnailUrl,
      };

      const result = await createGroup(groupData, userId as string);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Group created successfully!");
      router.push(`/groups/${result.group?.slug}`);
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-4 gap-8 mt-8"
      >
        <div className="col-span-2 space-y-4">
          <div className="flex flex-col space-y-2">
            <CustomInput
              className="w-full bg-foreground text-white/80 p-2 rounded-lg border border-white/30"
              type="text"
              name="name"
              label="Name"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <CustomTextarea
              rows={10}
              name="description"
              label="Description"
              placeholder="Enter a description for your group"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <CustomSwitch
              name="visibility"
              label="Is this group public?"
              description="If the group is public, anyone can join and see the group's content."
            />

            {/* <label className="text-white text-sm" htmlFor="name">
              Visibility
            </label>
            <p className="text-white/30 text-sm">Who can see this group?</p>

            <select
              className="w-full bg-foreground text-white/80 p-2 rounded-lg border border-white/30"
              id="visibility"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select> */}
          </div>
        </div>

        <div className="col-span-2 space-y-4">
          <div className="flex space-x-4 row-span-6 ">
            <div className="flex flex-col space-y-2">
              <FileInput
                className="h-32 w-32  border-2 grid z-10 place-items-center text-center"
                name="avatar"
                label="Upload your avatar"
              />
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <FileInput name="thumbnail" label="Upload group thumbnail" />
            </div>
          </div>

          <div className="flex flex-col space-y-4 col-span-2 ">
            <div className="flex space-x-4 w-full items-center">
              <CustomSwitch
                name="allowMemberPosts"
                label="Allow Members to Post"
                description="Allow members to post in the group"
              />
            </div>

            <div className="flex space-x-4 items-center">
              <CustomSwitch
                name="allowMemberInvites"
                label="Allow Members to Invite"
                description="Allow members to invite other members to the group"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 col-span-2">
            <Button className="bg-foreground text-xs text-white p-2 rounded-lg">
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-xs text-white p-2 rounded-lg">
              Create Group
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

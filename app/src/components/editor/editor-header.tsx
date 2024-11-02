"use client";

import { Note, Tag as TagType, User } from "@prisma/client";
import EditorSettings from "./editor-settings";
import React, { ChangeEvent } from "react";
import { Input } from "../ui/input";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner";
import { updateNote } from "@/actions/notes";
import slug from "slug";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistance } from "date-fns";
import Tag from "../ui/tag";
import Link from "next/link";
import { APP_BASE_URL } from "@/lib/constants";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toggleNoteFavorite } from "@/actions/user-notes";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

interface EditorHeaderProps {
  note: Note & {
    user: User;
    tags: TagType[];
  };
  settingsOff: boolean;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ note, settingsOff }) => {
  const { user } = useUser();

  const { refresh, replace } = useRouter();

  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user && note.favoritedByIds) {
      const _isFavorited = note.favoritedByIds.includes(user.id);
      setIsFavorited(_isFavorited);
    }
  }, [user, note.favoritedByIds]);

  const toggleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isUpdating) return;

    setIsUpdating(true);
    setIsFavorited(!isFavorited);

    try {
      const result = await toggleNoteFavorite(user?.id as string, note.id);

      if (result.success) {
        toast.success(
          result.isFavorited
            ? "Note added to favorites"
            : "Note removed from favorites"
        );
        refresh();
      } else {
        setIsFavorited(isFavorited);
        toast.error(result.error || "Failed to update favorite status");
      }
    } catch {
      setIsFavorited(isFavorited);
      toast.error("Failed to update favorite status");
    } finally {
      setIsUpdating(false);
    }
  };

  const debouncedUpdates = useDebouncedCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const isTitle = e.target.name === "title";
      if (isTitle) {
        const _slug = `${slug(e.target.value)}-${note.id}`;
        const isTitleUpdated = await updateNote(note.id, {
          title: e.target.value,
          slug: _slug,
        });

        if (isTitleUpdated) {
          toast.success("Updated successfully.");
          replace(`/notes/${_slug}`);
          refresh();
        }
        return;
      }

      const isUpdated = await updateNote(note.id, {
        [e.target.name]: e.target.value,
      });
      if (isUpdated) {
        toast.success(`Updated successfully.`);
        refresh();
        return;
      }
      toast.error("Something went wrong!");
    },
    1000
  );

  const noteURL = `${APP_BASE_URL}/notes/${note.slug}?share_link=${note.shareLink}`;

  return (
    <React.Fragment>
      {!settingsOff && (
        <div className="w-full flex justify-end mb-4 space-x-2 pt-16">
          <Link href={noteURL} target="_blank" className="relative z-50">
            <Eye className="text-white/30 hover:text-white" />
          </Link>
          <EditorSettings note={note} />
        </div>
      )}

      {settingsOff && (
        <div className="flex flex-col items-center">
          <div className="z-50 space-x-2 relative flex flex-wrap">
            {note.tags.map((tag) => (
              <Tag key={tag.id} tag={tag.name} />
            ))}
          </div>
          <div className="flex w-full justify-between items-center mb-2 mt-8 z-30 relative">
            <div className="flex w-fit space-x-2 items-center bg-transparent">
              <Avatar className="mb-[1px]">
              {/* border-2 border-gray-700 */}
                <AvatarImage src={note.user.avatar as string} />
                <AvatarFallback className="w-full grid place-items-center bg-background text-white/30 text-md">
                  U
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-muted-foreground">
                {note.user.fullname}
                {/* <span className="text-xs text-muted-foreground/60">
                  @{note.user.username}
                </span> */}
              </p>
            </div>
            <div className="flex w-fit h-fit gap-4">
              <div className="flex w-fit h-fit items-end gap-2">
                <p className="text-md text-white/90 h-fit">Published</p>
                <p className="text-sm text-muted-foreground/60 h-fit m-[1px]">
                  {formatDistance(new Date(note.createdAt), new Date())}
                </p>
              </div>
              <div className="flex w-fit h-fit items-end gap-2">
                <p className="text-md text-white/90 h-fit">Updated</p>
                <p className="text-sm text-muted-foreground/60 h-fit m-[1px]">
                  {formatDistance(new Date(note.updatedAt), new Date())}
                </p>
              </div>
              {isFavorited ? (
                <Button
                  className="mt-[4px] p-0 w-fit h-fit shadow-none hover:bg-transparent bg-transparent"
                  onClick={toggleFavorite}
                  disabled={isUpdating}
                >
                  <Heart
                    className={`w-24 h-24 transition-all duration-200 stroke-red-700 fill-red-700 ${
                      isUpdating ? "opacity-50" : ""
                    }`}
                  />
                </Button>
              ) : (
                note.userId !== user?.id && (
                  <Button
                    className="mt-[4px] p-0 w-fit h-fit shadow-none hover:bg-transparent bg-transparent active:fill-red-900"
                    onClick={toggleFavorite}
                    disabled={isUpdating}
                  >
                    <Heart
                      className={`w-24 h-24 text-white/70 transition-all duration-200 ${
                        isUpdating ? "opacity-50" : ""
                      }`}
                    />
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      <div className="z-12 w-full space-y-4">
        <Input
          className="pl-0 w-full text-4xl font-semibold text-white placeholder:text-primary border-t-0 border-l-0 border-r-0 border-b-1 pb-4 h-auto rounded-none border-primary shadow-none focus-visible:ring-0"
          placeholder="Enter a title"
          name="title"
          readOnly={settingsOff}
          defaultValue={note.title}
          onChange={debouncedUpdates}
        />

        <Input
          className="pl-0 w-full text-xl font-medium text-white placeholder:text-primary border-t-0 border-l-0 border-r-0 border-b-1 pb-4 h-auto rounded-none border-primary shadow-none focus-visible:ring-0"
          placeholder="Enter a description"
          name="description"
          readOnly={settingsOff}
          defaultValue={note.description}
          onChange={debouncedUpdates}
        />
      </div>
    </React.Fragment>
  );
};

export default EditorHeader;

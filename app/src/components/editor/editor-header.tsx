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

  const [isFavoritedState, setIsFavoritedState] = useState<boolean>();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const _isFavorited = note.favoritedByIds.some((userId) => userId === user?.id)
    setIsFavoritedState(_isFavorited)
  }, [isFavoritedState]);

  

  const toggleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isUpdating) return;

    setIsUpdating(true);
    setIsFavoritedState(!isFavoritedState);

    try {
      const result = await toggleNoteFavorite(user?.id as string, note.id);

      if (result.success) {
        toast.success(
          result.isFavorited
            ? "Note added to favorites"
            : "Note removed from favorites"
        );

        setIsFavoritedState(result.isFavorited ? true: false)
        refresh();
      } else {
        setIsFavoritedState(isFavoritedState);
        toast.error(result.error || "Failed to update favorite status");
      }
    } catch {
      setIsFavoritedState(isFavoritedState);
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
        <div className="flex flex-col items-end">
          <div className="z-50 space-x-2 relative flex flex-wrap">
            {note.tags.map((tag) => (
              <Tag key={tag.id} tag={tag.name} />
            ))}
          </div>
          <div className="flex w-full justify-between mt-6 z-30 relative">
            <div className="flex w-fit mb-4 space-x-2 items-center p-2 bg-foreground border-2 border-primary rounded-lg">
              <Avatar className="border-2 border-gray-700 ">
                <AvatarImage src={note.user.avatar as string} />
                <AvatarFallback className="w-full grid place-items-center bg-background text-white/30 text-md">
                  U
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-muted-foreground flex flex-col ">
                {note.user.fullname}
                <span className="text-xs text-muted-foreground/60">
                  @{note.user.username}
                </span>
              </p>
            </div>
            <div className="text-right flex space-x-6">
              {isFavoritedState ? (
                <Button
                  variant="ghost"
                  className="absolute right-2 bottom-2 p-2"
                  onClick={toggleFavorite}
                  disabled={isUpdating}
                >
                  <Heart
                    className={`w-6 h-6 transition-all duration-200 stroke-red-700 fill-red-700 ${
                      isUpdating ? "opacity-50" : ""
                    }`}
                  />
                </Button>
              ) : (
                note.userId !== user?.id && (
                  <Button
                    variant="ghost"
                    className="absolute right-2 bottom-2 p-2"
                    onClick={toggleFavorite}
                    disabled={isUpdating}
                  >
                    <Heart
                      className={`w-6 h-6 text-white/70 transition-all duration-200 ${
                        isUpdating ? "opacity-50" : ""
                      }`}
                    />
                  </Button>
                )
              )}
              <div>
                <p className="text-md text-white">Published</p>
                <p className="text-sm text-muted-foreground/60">
                  {formatDistance(new Date(note.createdAt), new Date())}
                </p>
              </div>
              <div>
                <p className="text-md text-white">Updated</p>
                <p className="text-sm text-muted-foreground/60">
                  {formatDistance(new Date(note.updatedAt), new Date())}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full space-y-4">
        <Input
          className="w-full text-4xl font-semibold text-white placeholder:text-primary border-t-0 border-l-0 border-r-0 border-b-2 pb-4 h-auto rounded-none border-primary rounded-b-2xl shadow-none focus-visible:ring-0"
          placeholder="Enter a title"
          name="title"
          readOnly={settingsOff}
          defaultValue={note.title}
          onChange={debouncedUpdates}
        />

        <Input
          className="w-full text-xl font-medium text-white placeholder:text-primary border-t-0 border-l-0 border-r-0 border-b-2 pb-4 h-auto rounded-none border-primary rounded-b-xl shadow-none focus-visible:ring-0"
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useCopyToClipboard } from "usehooks-ts";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Copy,
  Eye,
  Images,
  Settings,
  Share2,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Note } from "@prisma/client";
import { deleteNote, setNoteVisibility, updateNote } from "@/actions/notes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { APP_BASE_URL } from "@/lib/constants";
import ComboBox from "../ui/combobox";
import { getAllTagsWithoutPartial } from "@/actions/tags";
import { Label } from "../ui/label";
import Image from "next/image";
import { onUpload } from "./image-upload";

interface EditorSettingsProps {
  note: Note;
}

const EditorSettings: React.FC<EditorSettingsProps> = ({ note }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCopiedLink] = useCopyToClipboard();
  const [shareLink, setShareLink] = useState("");
  const [, setDefaultSelectedTags] = useState<
    { value: string; label: string; id: string }[]
  >([]);

  const [selectedTags, setSelectedTags] = useState<
    { value: string; label: string; id: string }[]
  >([]);

  const router = useRouter();

  useEffect(() => {
    const noteURL = `${APP_BASE_URL}/notes/${note.slug}?share_link=${note.shareLink}`;
    if (note) setShareLink(noteURL);
  }, [note]);

  useEffect(() => {
    const fetchTags = async () => {
      const allTags = await getAllTagsWithoutPartial();
      if (allTags) {
        note.tagIds.forEach((tagId) => {
          const tag = allTags.find((tag) => tag.id === tagId);
          if (tag) {
            setDefaultSelectedTags((prev) => [
              ...prev,
              { id: tag.id, value: tag.name, label: tag.name },
            ]);
          }
        });
      }
    };

    fetchTags();
  }, [note.tagIds]);

  // Copy share link func.
  const handleCopyShareLink = () => {
    setCopiedLink(shareLink)
      .then(() => toast.success("You have copied share link."))
      .catch(() => toast.error("Copying process failed."));
  };

  // Handling changing visibility.
  const onVisibilityChange = async (isVisible: boolean) => {
    if (isVisible) {
      const isPublic = await setNoteVisibility(note.id, isVisible);
      if (isPublic) {
        toast.success("Visibility changed as public.");
        router.refresh();
        return;
      }
      toast.error(
        "Something wrong! Your note visibility couldn't changed as public"
      );
      return;
    }

    const isPrivate = await setNoteVisibility(note.id, isVisible);
    if (isPrivate) {
      toast.success("Visibility changed as private.");
      router.refresh();
      return;
    }

    toast.error(
      "Something wrong! Your note visibility couldn't changed as private"
    );
  };

  // Handling note removing func.
  const handleNoteDelete = async () => {
    const isDeleted = await deleteNote(note.id);
    if (isDeleted) {
      toast.success("Note deleted successfully.");
      router.push("/");
      router.refresh();
      return;
    }

    toast.error("Something went wrong!");
  };

  // Handle func. to save tags
  const handleSaveTagsToNote = async () => {
    const tags = selectedTags;
    const isUpdated = await updateNote(note.id, {
      tags: {
        connect: tags.map((tag) => ({
          id: tag.id,
        })),
      },
    });

    if (isUpdated) {
      toast.success("Tags updated successfully.");
      router.refresh();
      return;
    }

    toast.error("Something went wrong!");
  };

  // Handle upload image
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    // Check file size (e.g., 5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("File size should be less than 5MB");
      return;
    }

    try {
      const imageUrl = await onUpload(file);
      if (!imageUrl) return;
      const isUpdated = await updateNote(note.id, {
        thumbnail: imageUrl,
      });

      if (isUpdated) {
        toast.success("Thumbnail updated successfully.");
        router.refresh();
        return;
      }
    } catch {
      toast.error("Something went wrong! Try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="text-white/30 hover:text-white z-30">
        <Settings />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-white">Note Settings</DialogTitle>
          <DialogDescription>Manage your note settings.</DialogDescription>
        </DialogHeader>
        <div className="w-full h-[1px] bg-secondary"></div>
        {/* Set thumbnail */}
        <div>
          <h3 className="text-sm text-white font-semibold flex items-center">
            <Images className="mr-2" size={16} />
            Thumbnail
          </h3>
          <p className="text-xs text-white/30">
            {`Set your note thumbnail from below.`}
          </p>

          <div className="flex space-x-2 mt-2 h-[150px] w-full relative">
            <Label
              htmlFor="thumbnail"
              className="w-full h-full border-2 grid z-10 place-items-center text-white rounded-lg border-white border-dashed cursor-pointer"
            >
              Upload your image
            </Label>
            <Image
              src={
                note.thumbnail ?? "/assets/images/default-note-thumbnail.jpg"
              }
              width={0}
              height={0}
              alt=""
              sizes="100vw"
              className="absolute left-0 z-0 mr-0 p-[2px] w-full h-full rounded-lg object-cover opacity-20"
              style={{ margin: 0 }}
            />
            <Input
              type="file"
              name="thumbnail"
              id="thumbnail"
              className="text-white/50 hidden"
              onChange={handleUploadImage}
            />
          </div>
        </div>
        {/* Share link comp. */}
        <div>
          <h3 className="text-sm text-white font-semibold flex items-center">
            <Share2 className="mr-2" size={16} />
            Share Link
          </h3>
          <p className="text-xs text-white/30">
            {`You can copy your note's share link from below.`}
          </p>

          <div className="flex space-x-2 mt-2">
            <Input
              readOnly
              className="text-white/50 border-secondary focus-visible:ring-0 text-white"
              value={shareLink}
            />
            <Button className="text-white" onClick={handleCopyShareLink}>
              <Copy size={16} />
            </Button>
          </div>

          {/* Change visibility */}
          <div className="mt-4">
            <h3 className="text-sm text-white font-semibold flex items-center">
              <Eye className="mr-2" size={16} />
              Visibility
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/30">
                {`Set your note visibility as public or private`}
              </p>
              <Switch
                className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-foreground"
                onCheckedChange={onVisibilityChange}
                defaultChecked={note.isPublic}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col items-end">
            <h3 className="text-sm text-white w-full font-semibold flex items-center">
              <Tag className="mr-2" size={16} />
              Tags
            </h3>
            <p className="text-xs text-white/30 mb-2 w-full">
              {`Match your notes with tags in the app or add new tags`}
            </p>
            <div className="flex items-center justify-between w-full">
              <ComboBox
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
              />
            </div>
            <Button
              className="mt-2 text-foreground bg-white w-fit hover:bg-white/70"
              size="sm"
              onClick={handleSaveTagsToNote}
            >
              Save Tags
            </Button>
          </div>
        </div>
        {/* Delete Process */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="destructive" className="w-fit">
              <Trash2 />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex space-x-1 bg-foreground">
            <DropdownMenuItem
              onClick={handleNoteDelete}
              className="bg-primary cursor-pointer"
            >
              Yes, delete it.
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <X />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DialogContent>
    </Dialog>
  );
};

export default EditorSettings;

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

import { Copy, Eye, Settings, Share2, Tag, Trash2, X } from "lucide-react";
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
import { getAllTags, getAllTagsWithoutPartial } from "@/actions/tags";

interface EditorSettingsProps {
  note: Note;
}

const EditorSettings: React.FC<EditorSettingsProps> = ({ note }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCopiedLink] = useCopyToClipboard();
  const [shareLink, setShareLink] = useState("");
  const [defaultTags, setDefaultTags] = useState<
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
      const tags = await getAllTags();
      if (tags) {
        setDefaultTags(tags);
      }

      const allTags = await getAllTagsWithoutPartial();
      if (allTags) {
        note.tagIds.forEach((tagId) => {
          const tag = allTags.find((tag) => tag.id === tagId);
          if (tag) {
            setSelectedTags((prev) => [
              ...prev,
              { id: tag.id, value: tag.name, label: tag.name },
            ]);
          }
        });
      }
    };

    fetchTags();
  }, []);

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

  return (
    <Dialog>
      <DialogTrigger className="text-white/30 hover:text-white">
        <Settings />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-white">Note Settings</DialogTitle>
          <DialogDescription>Manage your note settings.</DialogDescription>
        </DialogHeader>
        <div className="w-full h-[1px] bg-secondary"></div>

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
                defaultTags={defaultTags}
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

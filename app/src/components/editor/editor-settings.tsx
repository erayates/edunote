import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useCopyToClipboard } from "usehooks-ts";

import { Copy, Settings } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const EditorSettings: React.FC = () => {
  const [copiedLink, setCopiedLink] = useCopyToClipboard();

  const handleCopyShareLink = (link: string) => {
    setCopiedLink(link)
      .then(() => toast.success("You have copied share link."))
      .catch(() => toast.error("Copying process failed."));
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

        <div className="">
          <h3 className="text-sm text-white font-semibold">Share Link</h3>
          <p className="text-xs text-white/30">
            You can copy your note's share link from below.
          </p>

          <div className="flex space-x-2 mt-2">
            <Input
              readOnly
              className="text-white/50 border-secondary focus-visible:ring-0 text-white"
              value={
                "https://www.notion.so/erayates/6fb80ff97f414cdaa540d9030b9d53b5"
              }
            />
            <Button
              className="text-white"
              onClick={() =>
                handleCopyShareLink(
                  "https://www.notion.so/erayates/6fb80ff97f414cdaa540d9030b9d53b5"
                )
              }
            >
              <Copy size={16} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditorSettings;

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteNote() {
  return (
    <Dialog>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-2">
        <DialogHeader>
          <DialogTitle>Are you sure want to delete?</DialogTitle>
          <DialogDescription>
            This process cannot be undone. Are you sure?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start py-4 px-6">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              No, cancel.
            </Button>

            <Button type="button" variant="destructive">
              Yes, delete it.
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

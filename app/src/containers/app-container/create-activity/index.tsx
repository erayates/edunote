import { PlusCircle } from "lucide-react";
import * as React from "react";

export function CreateActivity() {
  return (
    <div className="grid grid-cols-3 gap-6 w-full">
      <div className="flex w-full bg-foreground flex-col py-5 items-start justify-between rounded-md border px-4 sm:flex-row sm:items-center">
        <p className="text-sm font-medium leading-none">
          <span className="text-muted-foreground">Create a new note</span>
        </p>
        <PlusCircle className="text-white/30" />
      </div>

      <div className="flex w-full bg-foreground flex-col py-5 items-start justify-between rounded-md border px-4 sm:flex-row sm:items-center">
        <p className="text-sm font-medium leading-none">
          <span className="text-muted-foreground">Create a new group</span>
        </p>
        <PlusCircle className="text-white/30" />
      </div>

      <div className="flex w-full bg-foreground flex-col py-5 items-start justify-between rounded-md border px-4 sm:flex-row sm:items-center">
        <p className="text-sm font-medium leading-none">
          <span className="text-muted-foreground">Create a new quiz</span>
        </p>
        <PlusCircle className="text-white/30" />
      </div>
    </div>
  );
}

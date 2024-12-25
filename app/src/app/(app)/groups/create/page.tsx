import CreateGroup from "@/features/group/components/create-group";
import { BadgePlus } from "lucide-react";
import React from "react";

const CreateGroupPage = () => {
  return (
    <React.Fragment>
      <div className="w-full flex items-center justify-between bg-foreground p-6 rounded-lg border border-white/30">
        <div>
          <h1 className="text-white text-3xl font-semibold">Create Group</h1>
          <p className="text-white/30 text-sm">
            Create a new group to share notes and resources with your
            classmates.
          </p>
        </div>
        <BadgePlus className="text-white" size={64} />
      </div>

      <CreateGroup />
    </React.Fragment>
  );
};

export default CreateGroupPage;

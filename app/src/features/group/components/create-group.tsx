import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const CreateGroup = () => {
  return (
    <div className="grid grid-cols-4 gap-8 mt-8">
      <div className="col-span-2 space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-white text-sm" htmlFor="name">
            Name
          </label>
          <input
            className="w-full bg-foreground text-white/80 p-2 rounded-lg border border-white/30"
            id="name"
            type="text"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-white text-sm" htmlFor="name">
            Description
          </label>
          <textarea
            className="w-full bg-foreground text-white/80 p-2 rounded-lg border border-white/30"
            id="description"
            rows={10}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-white text-sm" htmlFor="name">
            Visibility
          </label>
          <p className="text-white/30 text-sm">Who can see this group?</p>

          <select
            className="w-full bg-foreground text-white/80 p-2 rounded-lg border border-white/30"
            id="visibility"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      <div className="col-span-2 space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-white text-sm" htmlFor="name">
            Invite Members
          </label>
          <input
            className="w-full bg-foreground text-white/80 p-2 rounded-lg border border-white/30"
            id="invite"
            type="text"
          />
        </div>

        <div className="flex justify-start space-x-8 col-span-2 ">
          <div className="flex space-x-4 items-center">
            <label className="text-white text-sm" htmlFor="name">
              Allow Members to Post
            </label>

            <Switch
              className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-foreground"
              // onCheckedChange={onVisibilityChange}
              // defaultChecked={note.isPublic}
            />
          </div>

          <div className="flex space-x-4 items-center">
            <label className="text-white text-sm" htmlFor="name">
              Allow Members to Invite
            </label>

            <Switch
              className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-foreground"
              // onCheckedChange={onVisibilityChange}
              // defaultChecked={note.isPublic}
            />
          </div>
        </div>

        <div className="flex space-x-4 row-span-6 ">
          <div className="flex flex-col space-y-2">
            <Label
              htmlFor="thumbnail"
              className="h-32 w-32 bg-primary border-2 grid z-10 place-items-center text-center text-white rounded-lg border-white border-dashed cursor-pointer"
            >
              Upload group thumbnail
            </Label>
            {/* <Image
              src={
                note.thumbnail ?? "/assets/images/default-note-thumbnail.jpg"
              }
              width={0}
              height={0}
              alt=""
              sizes="100vw"
              className="absolute left-0 z-0 mr-0 p-[2px] w-full h-full rounded-lg object-cover opacity-20"
              style={{ margin: 0 }}
            /> */}
            <Input
              type="file"
              name="thumbnail"
              id="thumbnail"
              className="text-white/50 hidden"
              // onChange={handleUploadImage}
            />
          </div>
          <div className="flex flex-col space-y-2 w-full">
            <Label
              htmlFor="thumbnail"
              className="w-full h-64 bg-primary border-2 grid z-10 place-items-center text-white rounded-lg border-white border-dashed cursor-pointer"
            >
              Upload group thumbnail
            </Label>
            {/* <Image
              src={
                note.thumbnail ?? "/assets/images/default-note-thumbnail.jpg"
              }
              width={0}
              height={0}
              alt=""
              sizes="100vw"
              className="absolute left-0 z-0 mr-0 p-[2px] w-full h-full rounded-lg object-cover opacity-20"
              style={{ margin: 0 }}
            /> */}
            <Input
              type="file"
              name="thumbnail"
              id="thumbnail"
              className="text-white/50 hidden"
              // onChange={handleUploadImage}
            />
          </div>
        </div>

        {/* <button className="bg-primary text-white p-2 rounded-lg">
          Create Group
        </button>

        <button className="bg-foreground text-white p-2 rounded-lg">
          Cancel
        </button> */}
      </div>
    </div>
  );
};

export default CreateGroup;

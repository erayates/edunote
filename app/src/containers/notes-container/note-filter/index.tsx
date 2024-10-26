import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";

const NoteFilter: React.FC = () => {
  return (
    <div className="w-[280px] sticky top-4  h-fit bg-foreground border-2 border-secondary rounded-xl p-2">
      <p className="text-white/30 uppercase font-semibold text-center text-xl">
        Filters
      </p>

      <div className="rounded-full h-[1px] w-full bg-secondary my-2"></div>
      <div className="space-y-2">
        <div className="space-y-1">
          <p className="text-sm text-white/30 font-medium">Tags</p>
          <Input className="focus-visible:ring-secondary text-white text-xs" />
        </div>

        <div className="space-y-1">
          <p className="text-sm text-white/30 font-medium">Author</p>
          <Input className="focus-visible:ring-secondary text-white text-xs" />
        </div>

        <div className="space-y-1">
          <p className="text-sm text-white/30 font-medium">Published Date</p>
          <DatePicker />
        </div>
      </div>
    </div>
  );
};

export default NoteFilter;
